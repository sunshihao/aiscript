const fs = require('fs');
const path = require('path');

// ==================== 配置 ====================

// 配置目标目录路径
const CONFIG = {
  targetDirectory: '/Users/ssh/Home/workspace/ZKY/demo-ai/source/approve', // 扫描目录
  backupSuffix: '-old', // 备份文件的后缀
  logDir: '/Users/ssh/Home/workspace/ZKY/demo-ai/dist/log' // 日志目录
};

// 类名映射配置
const CLASS_MAPPINGS = {
  form: {
    'panel panel-default searchTool fl': 'panel panel-default searchTool',
    'panel-body': 'z-page-search-form',
    'w110 name': 'name',
    'w140 mt8': '',
    'searchTool': 'searchTool'
  },
  table: {
    'table': 'z-page-search-componets'
  }
};

// ==================== 基础文件操作函数 ====================

// 读取文件函数
function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

// 写入文件函数
function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}

// 创建目录
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// 递归获取目录下所有JSP文件
function getAllJspFiles(dirPath) {
  const results = [];
  
  function traverse(currentPath) {
    const files = fs.readdirSync(currentPath);
    
    for (const file of files) {
      const fullPath = path.join(currentPath, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (file.toLowerCase().endsWith('.jsp') && !file.includes(CONFIG.backupSuffix)) {
        results.push(fullPath);
      }
    }
  }
  
  traverse(dirPath);
  return results;
}

// ==================== 文件匹配和筛选 ====================

// 检查JSP文件结构
function checkJspStructure(filePath) {
  try {
    let content = readFile(filePath);
    
    // 检查是否已经包含z-开头的类名
    const hasZClass = /<[^>]*class="[^"]*z-[^"]*"[^>]*>/i.test(content);
    
    // 如果包含z-开头的类名，则跳过此文件，不进行后续处理
    if (hasZClass) {
      console.log(`跳过已包含z-class的文件: ${filePath}`);
      return null; // 返回null表示不处理
    }

    // 原有的form和panel检查逻辑
    const formMatch = /<form[^>]*>/i.exec(content);
    const panelMatch = /<div[^>]*class="[^"]*panel\s+panel-default[^"]*"[^>]*>/i.exec(content);

    if (formMatch && panelMatch) {
      const formIndex = formMatch.index;
      const panelIndex = panelMatch.index;

      if (formIndex < panelIndex) {
        // 文件符合条件，返回文件信息
        return {
          path: filePath,
          filename: path.basename(filePath),
          directory: path.dirname(filePath)
        };
      }
    }
    
    return null; // 不符合条件
  } catch (err) {
    console.error(`处理文件时出错 ${filePath}:`, err);
    return null;
  }
}

// ==================== 结构处理函数 ====================

// 添加页面基础结构
function addPageStructure(content) {
  let updatedContent = content;
  
  // 添加z-page-home结构
  if (!updatedContent.includes('z-page-home')) {
    // 修改正则表达式以适应更多情况
    updatedContent = updatedContent.replace(
      /<body[^>]*>/i,
      (match) => `${match}\n<div class="z-page-home">\n    <div class="z-page-title"></div>`
    );
    
    // 如果没有找到body标签，则在文件开头添加
    if (!updatedContent.match(/<body[^>]*>/i)) {
      updatedContent = `<body>\n<div class="z-page-home">\n    <div class="z-page-title"></div>\n${updatedContent}`;
    }
    
    // 确保在文件末尾关闭div标签
    if (!updatedContent.includes('</div></div></body>')) {
      updatedContent = updatedContent.replace('</body>', '</div></div></body>');
    }
  }
  
  return updatedContent;
}

// 处理form标签结构
function processFormStructure(content) {
  // 为form标签添加z-page-search类
  let updatedContent = content.replace(
    /<form([^>]*?)>/g,
    (match, attributes) => {
      if (attributes.includes('class=')) {
        return match.replace(/class="([^"]*)"/, 'class="$1 z-page-search"');
      } else {
        return match.replace('<form', '<form class="z-page-search"');
      }
    }
  );
  
  // 在form后添加操作区域
  updatedContent = updatedContent.replace(
    /(<form[^>]*>)([\s\S]*?)(<\/form>)/gi,
    (match, formStart, formContent, formEnd) => {
      return `${formStart}${formContent}${formEnd}\n<div id="actionArea" class="z-page-action z-btn-define"></div>`;
    }
  );
  
  return updatedContent;
}

// 处理表格结构
function processTableStructure(content) {
  // 处理form中的table结构
  const formTableRegex = /(<form[^>]*>[\s\S]*?<table[^>]*>)([\s\S]*?)(<\/table>[\s\S]*?<\/form>)/gi;
  
  return content.replace(formTableRegex, (match, formStart, tableContent, formEnd) => {
    // 查找最后一个tr及其内容
    const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    const trs = [...tableContent.matchAll(trRegex)];
    
    if (trs.length === 0) return match;
    
    // 分离最后一个tr的内容
    const lastTrMatch = trs[trs.length - 1];
    const lastTrContent = lastTrMatch[0];
    
    // 从表格内容中移除最后一个tr
    const newTableContent = tableContent.slice(0, lastTrMatch.index) + 
                          tableContent.slice(lastTrMatch.index + lastTrMatch[0].length);
    
    // 提取td标签中的内容
    const tdContents = [];
    const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    let tdMatch;
    while ((tdMatch = tdRegex.exec(lastTrContent)) !== null) {
      tdContents.push(tdMatch[1].trim());
    }
    
    // 合并所有td的内容
    const extractedContent = tdContents.join('\n');
    
    // 构建新的结构，将提取的内容放在table后面
    return `${formStart}${newTableContent}</table>\n<div class="z-page-search-fold">${extractedContent}</div>${formEnd.replace('</table>', '')}`;
  });
}

// 处理moreBtn内容
function processMoreBtn(content) {
  const formTableRegex = /(<form[^>]*>[\s\S]*?<table[^>]*>)([\s\S]*?)(<\/table>[\s\S]*?<\/form>)/gi;
  
  return content.replace(formTableRegex, (match, formStart, tableContent, formEnd) => {
    let moreBtnContent = '';
    
    // 处理table内容，提取moreBtn
    const processedTableContent = tableContent.replace(
      /<tr[^>]*>([\s\S]*?)<\/tr>/gi,
      (tr) => {
        let newTr = tr;
        
        // 处理moreBtn
        const moreBtnRegex = /<td[^>]*id="moreBtn"[^>]*>([\s\S]*?)<\/td>/i;
        const moreBtnMatch = tr.match(moreBtnRegex);
        if (moreBtnMatch) {
          moreBtnContent = moreBtnMatch[1].trim();
          newTr = tr.replace(moreBtnRegex, '');
        }
        
        return newTr;
      }
    );
    
    // 如果存在moreBtn内容，将其添加到z-page-search-fold中
    if (moreBtnContent) {
      // 检查是否已存在z-page-search-fold
      const foldDivRegex = /(<div class="z-page-search-fold"[^>]*>)([\s\S]*?)(<\/div>)/i;
      const hasFoldDiv = formEnd.match(foldDivRegex);
      
      if (hasFoldDiv) {
        // 在已有的fold div中追加内容
        formEnd = formEnd.replace(
          foldDivRegex,
          (match, divStart, content, divEnd) => 
            `${divStart}${content}\n${moreBtnContent}${divEnd}`
        );
      } else {
        // 在table后创建新的fold div
        formEnd = formEnd.replace(
          '</table>',
          `</table>\n<div class="z-page-search-fold">${moreBtnContent}</div>`
        );
      }
    }
    
    return `${formStart}${processedTableContent}${formEnd}`;
  });
}

// 处理按钮位置
function processButtonPositions(content) {
  // 查找z-page-search-fold中的按钮
  let updatedContent = content;
  
  // 正则表达式匹配z-page-search-fold div
  const foldDivRegex = /(<div\s+class="z-page-search-fold"[^>]*>)([\s\S]*?)(<\/div>)/gi;
  
  // 存储所有需要移动到操作区的按钮
  const allActionButtons = [];
  
  // 处理所有z-page-search-fold div
  updatedContent = updatedContent.replace(
    foldDivRegex,
    (match, divStart, divContent, divEnd) => {
      // 提取所有input按钮
      const buttonRegex = /<input[^>]*type="button"[^>]*value="([^"]*)"[^>]*>/gi;
      const buttons = [];
      let buttonMatch;
      let otherContent = divContent;
      
      // 收集所有按钮并从原内容中移除
      while ((buttonMatch = buttonRegex.exec(divContent)) !== null) {
        const buttonValue = buttonMatch[1].trim();
        const fullButton = buttonMatch[0];
        
        buttons.push({
          value: buttonValue,
          html: fullButton
        });
        
        // 从原内容中移除按钮
        otherContent = otherContent.replace(fullButton, '');
      }
      
      // 分类按钮
      const searchButtons = buttons.filter(btn => 
        btn.value === '查询' || btn.value === '重置');
      const actionButtons = buttons.filter(btn => 
        btn.value !== '查询' && btn.value !== '重置');
      
      // 将操作按钮添加到全局集合中
      allActionButtons.push(...actionButtons);
      
      // 重建z-page-search-fold内容
      let newFoldContent = searchButtons.map(btn => btn.html).join('\n');
      
      // 添加其他非按钮内容
      newFoldContent += otherContent;
      
      // 保留div即使它是空的
      return `${divStart}${newFoldContent}${divEnd}`;
    }
  );
  
  // 如果有需要移动的操作按钮
  if (allActionButtons.length > 0) {
    const actionButtonsHtml = allActionButtons.map(btn => btn.html).join('\n');
    
    // 查找id为actionArea的div
    const actionDivRegex = /<div\s+id="actionArea"[^>]*>([\s\S]*?)(<\/div>)/i;
    const actionDivMatch = updatedContent.match(actionDivRegex);
    
    if (actionDivMatch) {
      // 将操作按钮添加到现有的actionArea div中
      updatedContent = updatedContent.replace(
        actionDivRegex,
        `<div id="actionArea" class="z-page-action z-btn-define">${actionDivMatch[1]}${actionButtonsHtml}$2`
      );
    } else {
      // 在form后创建新的actionArea div
      updatedContent = updatedContent.replace(
        /<\/form>/i,
        `</form>\n<div id="actionArea" class="z-page-action z-btn-define">${actionButtonsHtml}</div>`
      );
    }
  } else {
    // 如果没有操作按钮，删除空的acationArea div
    updatedContent = updatedContent.replace(
      /<div\s+id="actionArea"\s+class="z-page-action\s+z-btn-define">\s*<\/div>\s*/gi,
      ''
    );
  }
  
  return updatedContent;
}

// 格式化代码
function formatCode(content) {
  return content
    .replace(/^\s+$/gm, '')  // 删除只包含空白字符的行
    .replace(/\n{3,}/g, '\n\n')  // 将多个空行替换为一个空行
    .replace(/\t/g, '    ');  // 将制表符替换为4个空格
}

// 转换JSP结构
function transformJSPStructure(content) {
  let result = content;
  
  // 添加页面基础结构
  result = addPageStructure(result);
  
  // 处理form标签结构
  result = processFormStructure(result);
  
  // 处理表格结构
  result = processTableStructure(result);
  
  // 处理moreBtn内容
  result = processMoreBtn(result);
  
  // 处理按钮位置
  result = processButtonPositions(result);
  
  // 格式化代码
  result = formatCode(result);
  
  return result;
}

// ==================== 属性处理函数 ====================

// 替换类名
function replaceClasses(content, classMapping) {
  let result = content;

  Object.entries(classMapping).forEach(([oldClass, newClass]) => {
    // 特殊处理 panel-body 类，当包含 padding-0 时不转换
    if (oldClass === 'panel-body') {
      const panelBodyRegex = /class="([^"]*panel-body[^"]*?)"/g;
      result = result.replace(panelBodyRegex, (match, classContent) => {
        // 如果包含 padding-0，则不进行转换
        if (classContent.includes('padding-0')) {
          return match;
        }
        // 否则进行正常转换
        return `class="${newClass}"`;
      });
    } else {
      // 其他类名正常处理
      const regex = new RegExp(`class="[^"]*${oldClass}[^"]*"`, 'g');
      result = result.replace(regex, `class="${newClass}"`);
    }
  });
  return result;
}

// 处理表格内容
function processTableContent(content) {
  // 处理表格中的tr内容
  return content.replace(
    /<tr[^>]*>([\s\S]*?)<\/tr>/gi,
    (trMatch) => {
      return processTrContent(trMatch);
    }
  );
}

// 处理tr内容
function processTrContent(trContent) {
  // 匹配包含name类的span的td和它的下一个td
  const pattern = /<td[^>]*>(?:\s*)<span[^>]*class="[^"]*name[^"]*"[^>]*>(.*?)<\/span>(?:\s*)<\/td>(?:\s*)<td[^>]*>([\s\S]*?)<\/td>/gi;
  
  let result = trContent.replace(pattern, (match, spanContent, nextTdContent) => {
    // 清理和格式化内容
    spanContent = spanContent.trim();
    nextTdContent = nextTdContent.trim();
    
    // 如果span内容不以冒号结束，添加冒号
    if (!spanContent.endsWith(':')) {
      spanContent += ':';
    }
    
    // 处理select标签中的-请选择-选项
    if (nextTdContent.includes('<select')) {
      nextTdContent = nextTdContent.replace(
        /<option[^>]*>-请选择-<\/option>/g,
        '<option value="">请选择</option>'
      );
    }
    
    // 构建新的TD
    return `<td>
                            <span class="name">${spanContent}</span>
                            ${nextTdContent}
                        </td>`;
  });
  
  // 处理radio类型的input
  result = result.replace(
    /<td[^>]*>(?=[\s\S]*?<input[^>]*type="radio"[^>]*>)([\s\S]*?)<\/td>/gi,
    (tdContent) => {
      // 检查td是否已经包含z-radio div
      if (!tdContent.includes('class="z-radio"')) {
        // 提取td标签的开始和结束部分
        const tdStart = tdContent.match(/^<td[^>]*>/)[0];
        const tdEnd = '</td>';
        // 获取td的内部内容
        const tdInner = tdContent.replace(/^<td[^>]*>|<\/td>$/g, '');
        
        // 提取所有radio类型的input
        const radioInputs = tdInner.match(/<input[^>]*type="radio"[^>]*>/g) || [];
        // 将所有radio inputs合并到一个z-radio div中
        const radioContent = radioInputs.length > 0 ? 
          tdInner.replace(
            new RegExp(radioInputs.map(input => input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g'),
            '<div class="z-radio">' + radioInputs.join('') + '</div>'
          ) : tdInner;
        
        return `${tdStart}${radioContent}${tdEnd}`;
      }
      return tdContent;
    }
  );
  
  return result;
}

// 处理表格属性
function processTableAttributes(content) {
  // 优化表格处理
  return content.replace(
    /<table(?:\s+[^>]*)?>/g,
    (match) => {
      if (match.includes('class=')) {
        return match.replace(/class="([^"]*)"/, (_, cls) => 
          `class="${cls} ${CLASS_MAPPINGS.table.table}"`);
      }
      return match.replace('<table', `<table class="${CLASS_MAPPINGS.table.table}"`);
    }
  );
}

// 处理input标签的class属性
function processInputClasses(content) {
  return content.replace(
    /<input[^>]*class="[^"]*"[^>]*>/gi,
    (match) => {
      // 提取class属性值
      const classMatch = match.match(/class="([^"]*)"/i);
      if (!classMatch) return match;
      
      const classValue = classMatch[1];
      // 移除以w开头后跟数字的class值
      const newClassValue = classValue
        .split(/\s+/)
        .filter(cls => !(/^w\d+$/.test(cls)))
        .join(' ')
        .trim();
      
      if (newClassValue === '') {
        // 如果class值为空，则删除整个class属性
        return match.replace(/\s+class="[^"]*"/i, '');
      } else {
        // 否则更新class值
        return match.replace(/class="[^"]*"/i, `class="${newClassValue}"`);
      }
    }
  );
}

// 为按钮添加z-btn-primary类
function addPrimaryButtonClass(content) {
  return content.replace(
    /<input[^>]*type="button"[^>]*value="([^"]*)"[^>]*>/gi,
    (match, value) => {
      // 如果value不是"重置"，添加z-btn-primary类
      if (value.trim().toLowerCase() !== '重置') {
        if (match.includes('class=')) {
          // 如果已经有class属性，检查是否已包含z-btn-primary
          if (!match.includes('z-btn-primary')) {
            return match.replace(/class="([^"]*)"/, 'class="$1 z-btn-primary"');
          }
        } else {
          // 如果没有class属性，添加一个
          return match.replace('<input', '<input class="z-btn-primary"');
        }
      }
      return match;
    }
  );
}

// 替换页面标题
function replacePageTitle(content) {
  // 提取title标签中的内容
  const titleMatch = content.match(/<title>(.*?)<\/title>/i);
  if (!titleMatch) return content;
  
  const titleContent = titleMatch[1].trim();
  
  // 查找并替换z-page-title div中的内容
  return content.replace(
    /<div\s+class="z-page-title">(.*?)<\/div>/i,
    `<div class="z-page-title">${titleContent}</div>`
  );
}

// 转换JSP属性
function transformJSPAttributes(content) {
  // 处理页面标题
  content = replacePageTitle(content);
  
  // 为按钮添加z-btn-primary类
  content = addPrimaryButtonClass(content);
  
  // 处理input标签的class属性
  content = processInputClasses(content);
  
  // 处理form标签内外的内容
  const formRegex = /<form[^>]*>([\s\S]*?)<\/form>/g;
  let lastIndex = 0;
  let result = '';

  // 找到所有的form标签
  const matches = [...content.matchAll(formRegex)];

  if (matches.length > 0) {
    matches.forEach(match => {
      const [fullMatch, formContent] = match;
      const offset = match.index;

      // 处理form标签之前的内容
      const beforeForm = content.slice(lastIndex, offset);
      result += replaceClasses(beforeForm, { ...CLASS_MAPPINGS.form, ...CLASS_MAPPINGS.table });

      // 处理form标签内的内容
      let transformedFormContent = replaceClasses(formContent, CLASS_MAPPINGS.form);
      transformedFormContent = processTableAttributes(transformedFormContent);
      transformedFormContent = processTableContent(transformedFormContent);
      
      result += fullMatch.replace(formContent, transformedFormContent);

      lastIndex = offset + fullMatch.length;
    });

    // 处理最后一个form标签之后的内容
    result += replaceClasses(content.slice(lastIndex), { ...CLASS_MAPPINGS.form, ...CLASS_MAPPINGS.table });
  } else {
    // 如果没有form标签，处理整个内容
    result = replaceClasses(content, { ...CLASS_MAPPINGS.form, ...CLASS_MAPPINGS.table });
    result = processTableAttributes(result);
    result = processTableContent(result);
  }

  return result;
}

// ==================== 完整处理流程 ====================

// 处理单个JSP文件
function processJspFile(filePath) {
  console.log(`处理文件: ${filePath}`);
  
  try {
    // 1. 创建备份文件
    const fileExt = path.extname(filePath);
    const fileBase = path.basename(filePath, fileExt);
    const fileDir = path.dirname(filePath);
    const backupPath = path.join(fileDir, `${fileBase}${CONFIG.backupSuffix}${fileExt}`);
    
    // 创建备份文件
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(filePath, backupPath);
      console.log(`创建备份文件: ${backupPath}`);
    } else {
      console.log(`备份文件已存在: ${backupPath}`);
    }
    
    // 2. 读取原始文件内容
    const originalContent = readFile(filePath);
    
    // 3. 应用结构转换
    console.log(`- 应用结构转换...`);
    const structureContent = transformJSPStructure(originalContent);
    
    // 4. 应用属性转换
    console.log(`- 应用属性转换...`);
    const finalContent = transformJSPAttributes(structureContent);
    
    // 5. 写回原文件
    writeFile(filePath, finalContent);
    
    console.log(`✓ 文件处理完成: ${filePath}`);
    return true;
  } catch (err) {
    console.error(`× 处理文件失败: ${filePath}`, err.message);
    return false;
  }
}

// 将结果写入日志文件
function writeResultsToLog(results) {
  // 获取当前日期
  const date = new Date();
  const dateStr = date.getFullYear() +
      String(date.getMonth() + 1).padStart(2, '0') +
      String(date.getDate()).padStart(2, '0');
  
  // 获取扫描目录名
  const scanDirName = path.basename(CONFIG.targetDirectory);
  
  // 构造日志文件名
  const logFileName = `jsp-transform-${dateStr}-${scanDirName}.txt`;
  const logPath = path.join(CONFIG.logDir, logFileName);
  
  // 确保日志目录存在
  ensureDirectoryExists(CONFIG.logDir);

  const output = results
      .map(
          (result) =>
              `文件: ${result.filename}\n目录: ${result.directory}\n完整路径: ${result.path}\n-------------------\n`
      )
      .join('\n');

  writeFile(logPath, output);
  console.log(`结果已写入日志文件: ${logPath}`);
}

// ==================== 主函数 ====================

async function main() {
  const targetDir = CONFIG.targetDirectory;

  if (!fs.existsSync(targetDir)) {
    console.error('指定的目录不存在：', targetDir);
    process.exit(1);
  }

  console.log('开始扫描目录...');
  
  // 获取所有JSP文件
  const allJspFiles = getAllJspFiles(targetDir);
  console.log(`找到 ${allJspFiles.length} 个JSP文件，开始检查匹配条件...`);
  
  // 筛选符合条件的文件
  const matchedFiles = [];
  const processResults = [];
  
  for (const filePath of allJspFiles) {
    const result = checkJspStructure(filePath);
    if (result) {
      matchedFiles.push(result);
    }
  }
  
  console.log(`找到 ${matchedFiles.length} 个符合条件的JSP文件，开始处理...`);
  
  // 处理每个匹配的文件
  for (const file of matchedFiles) {
    const success = processJspFile(file.path);
    processResults.push({
      ...file,
      success
    });
  }
  
  // 写入处理结果日志
  writeResultsToLog(matchedFiles);
  
  // 输出处理结果统计
  const successCount = processResults.filter(r => r.success).length;
  
  console.log('\n处理完成！');
  console.log(`总文件数: ${matchedFiles.length}`);
  console.log(`成功处理: ${successCount}`);
  console.log(`失败数量: ${matchedFiles.length - successCount}`);
}

// 执行主函数
main();