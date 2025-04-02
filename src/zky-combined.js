const fs = require('fs');
const path = require('path');

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
      } else if (file.toLowerCase().endsWith('.jsp')) {
        results.push(fullPath);
      }
    }
  }
  
  traverse(dirPath);
  return results;
}

// ==================== 第一阶段转换 (zky.js) ====================

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

// 第一阶段转换JSP
function transformJSP_Stage1(oldContent) {
  // 1. 处理基础结构
  let updatedContent = oldContent;

  // 2. 分别处理 form 标签内外的内容
  const formRegex = /<form[^>]*>([\s\S]*?)<\/form>/g;
  let lastIndex = 0;
  let result = '';

  // 找到所有的 form 标签
  const matches = [...updatedContent.matchAll(formRegex)];

  if (matches.length > 0) {
    matches.forEach(match => {
      const [fullMatch, formContent] = match;
      const offset = match.index;

      // 处理 form 标签之前的内容
      const beforeForm = updatedContent.slice(lastIndex, offset);
      result += transformOuterContent(beforeForm);

      // 处理 form 标签内的内容
      const transformedFormContent = transformInnerContent(formContent);
      result += fullMatch.replace(formContent, transformedFormContent);

      lastIndex = offset + fullMatch.length;
    });

    // 处理最后一个 form 标签之后的内容
    result += transformOuterContent(updatedContent.slice(lastIndex));
    updatedContent = result;
  }

  // 3. 添加页面结构
  if (!updatedContent.includes('z-page-home')) {
    // 为 form 标签添加 z-page-search 类
    updatedContent = updatedContent.replace(
      /<form([^>]*?)>/g,
      (match, attributes) => {
        if (attributes.includes('class=')) {
          return match.replace(/class="([^"]*)"/, 'class="$1 z-page-search"');
        } else {
          return match.replace('<form', '<form class="z-page-search"');
        }
      }
    );

    updatedContent = updatedContent.replace(
      '<body>',
      `<body>\n<div class="z-page-home">\n    <div class="z-page-title">仪器信息浏览</div>`
    );
  }

  // 4. 格式化代码
  updatedContent = updatedContent
    .replace(/^\s+$/gm, '')  // 删除只包含空白字符的行
    .replace(/\n{3,}/g, '\n\n')  // 将多个空行替换为一个空行
    .replace(/\t/g, '    ');  // 将制表符替换为4个空格

  return updatedContent;
}

// 转换 form 标签内的内容
function transformInnerContent(content) {
  let result = content;
  
  // 处理基本类名替换
  result = replaceClasses(result, CLASS_MAPPINGS.form);
  
  // 优化表格处理
  result = result.replace(
    /<table(?:\s+[^>]*)?>/g,
    (match) => {
      if (match.includes('class=')) {
        return match.replace(/class="([^"]*)"/, (_, cls) => 
          `class="${cls} ${CLASS_MAPPINGS.table.table}"`);
      }
      return match.replace('<table', `<table class="${CLASS_MAPPINGS.table.table}"`);
    }
  );

  return result;
}

// 转换 form 标签外的内容
function transformOuterContent(content) {
  return replaceClasses(content, { ...CLASS_MAPPINGS.form, ...CLASS_MAPPINGS.table });
}

// 辅助函数：替换类名
function replaceClasses(content, classMapping) {
  let result = content;
  Object.entries(classMapping).forEach(([oldClass, newClass]) => {
    const regex = new RegExp(`class="[^"]*${oldClass}[^"]*"`, 'g');
    result = result.replace(regex, `class="${newClass}"`);
  });
  return result;
}

// ==================== 第二阶段转换 (zky2.js) ====================

// 第二阶段转换JSP
function transformJSP_Stage2(content) {
  // 使用正则表达式匹配form中的table
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
    
    // 处理剩余的tr内容
    const processedTableContent = newTableContent.replace(trRegex, (trMatch) => {
      return processTrContent(trMatch);
    });
    
    // 提取td标签中的内容（保留td内的所有内容，但移除td标签本身）
    const tdContents = [];
    const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    let tdMatch;
    while ((tdMatch = tdRegex.exec(lastTrContent)) !== null) {
      tdContents.push(tdMatch[1].trim());
    }
    
    // 合并所有td的内容
    const extractedContent = tdContents.join('\n');
    
    // 构建新的结构，将提取的内容放在table后面
    return `${formStart}${processedTableContent}</table>\n<div class="z-page-search-fold">${extractedContent}</div>${formEnd.replace('</table>', '')}`;
  });
}

function processTrContent(trContent) {
  // 匹配包含name类的span的td和它的下一个td
  const pattern = /<td[^>]*>(?:\s*)<span[^>]*class="[^"]*name[^"]*"[^>]*>(.*?)<\/span>(?:\s*)<\/td>(?:\s*)<td[^>]*>([\s\S]*?)<\/td>/gi;
  
  return trContent.replace(pattern, (match, spanContent, nextTdContent) => {
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
}

// ==================== 第三阶段转换 (zky3.js) ====================

// 第三阶段转换JSP
function transformJSP_Stage3(content) {
  // 修改form标签处理逻辑
  content = content.replace(
    /(<form[^>]*>)([\s\S]*?)(<\/form>)/gi,
    (match, formStart, formContent, formEnd) => {
      return `${formStart}${formContent}${formEnd}\n<div class="z-page-action z-btn-define"></div>`;
    }
  );

  const formTableRegex = /(<form[^>]*>[\s\S]*?<table[^>]*>)([\s\S]*?)(<\/table>[\s\S]*?<\/form>)/gi;
  
  return content.replace(formTableRegex, (match, formStart, tableContent, formEnd) => {
    let moreBtnContent = '';
    
    // 处理table内容
    const processedTableContent = tableContent.replace(
      /<tr[^>]*>([\s\S]*?)<\/tr>/gi,
      (tr) => {
        let newTr = tr;
        
        // 处理radio类型的input
        newTr = newTr.replace(
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

        // 处理moreBtn（保持原有逻辑）
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

// ==================== 主函数 ====================

async function main() {
  // 定义处理路径
  const inputDir = path.join(__dirname, '../dist/matched-jsp');
  const stage1OutputDir = path.join(__dirname, '../dist/output');
  const stage2OutputDir = path.join(__dirname, '../dist/output-2');
  const finalOutputDir = path.join(__dirname, '../dist/output-final');

  try {
    // 确保所有输出目录存在
    ensureDirectoryExists(stage1OutputDir);
    ensureDirectoryExists(stage2OutputDir);
    ensureDirectoryExists(finalOutputDir);

    // 获取所有JSP文件
    const jspFiles = getAllJspFiles(inputDir);
    
    if (jspFiles.length === 0) {
      console.log('未找到JSP文件！');
      return;
    }

    console.log(`找到 ${jspFiles.length} 个JSP文件，开始处理...`);
    
    // 创建一个Map来存储转换结果
    const processedFiles = new Map();

    // 处理每个JSP文件
    for (const filePath of jspFiles) {
      // 计算相对路径
      const relativePath = path.relative(inputDir, filePath);
      const stage1Path = path.join(stage1OutputDir, relativePath);
      const stage2Path = path.join(stage2OutputDir, relativePath);
      const finalPath = path.join(finalOutputDir, relativePath);
      
      try {
        // 确保所有输出文件的目录结构存在
        ensureDirectoryExists(path.dirname(stage1Path));
        ensureDirectoryExists(path.dirname(stage2Path));
        ensureDirectoryExists(path.dirname(finalPath));

        // 第一阶段转换
        console.log(`[阶段1] 处理文件: ${relativePath}`);
        const originalContent = readFile(filePath);
        const stage1Content = transformJSP_Stage1(originalContent);
        writeFile(stage1Path, stage1Content);
        
        // 第二阶段转换
        console.log(`[阶段2] 处理文件: ${relativePath}`);
        const stage2Content = transformJSP_Stage2(stage1Content);
        writeFile(stage2Path, stage2Content);
        
        // 第三阶段转换
        console.log(`[阶段3] 处理文件: ${relativePath}`);
        const finalContent = transformJSP_Stage3(stage2Content);
        writeFile(finalPath, finalContent);
        
        // 记录处理结果
        processedFiles.set(relativePath, true);
        console.log(`✓ 完成转换: ${relativePath}`);
      } catch (err) {
        console.error(`× 转换失败: ${relativePath}`, err.message);
        processedFiles.set(relativePath, false);
      }
    }

    // 输出处理结果统计
    const totalFiles = processedFiles.size;
    const successFiles = [...processedFiles.values()].filter(Boolean).length;
    
    console.log('\n转换完成！');
    console.log(`总文件数: ${totalFiles}`);
    console.log(`成功转换: ${successFiles}`);
    console.log(`失败数量: ${totalFiles - successFiles}`);
    console.log(`最终输出目录: ${finalOutputDir}`);
    
  } catch (error) {
    console.error('处理过程中发生错误：', error);
  }
}

// 执行主函数
main();