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

// ==================== 处理HTML标签的层级嵌套结构 ====================

// 添加页面基础结构
function addPageStructure(content) {
  let updatedContent = content;
  
  // 添加z-page-home结构
  if (!updatedContent.includes('z-page-home')) {
    updatedContent = updatedContent.replace(
      '<body>',
      `<body>\n<div class="z-page-home">\n    <div class="z-page-title">仪器信息浏览</div>`
    );
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
      return `${formStart}${formContent}${formEnd}\n<div id="acationArea" class="z-page-action z-btn-define"></div>`;
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
    
    // 查找z-page-action div
    const actionDivRegex = /<div\s+class="z-page-action\s+z-btn-define"[^>]*>([\s\S]*?)(<\/div>)/i;
    const actionDivMatch = updatedContent.match(actionDivRegex);
    
    if (actionDivMatch) {
      // 将操作按钮添加到现有的z-page-action div中
      updatedContent = updatedContent.replace(
        actionDivRegex,
        `<div class="z-page-action z-btn-define">${actionDivMatch[1]}${actionButtonsHtml}$2`
      );
    } else {
      // 在form后创建新的z-page-action div
      updatedContent = updatedContent.replace(
        /<\/form>/i,
        `</form>\n<div class="z-page-action z-btn-define">${actionButtonsHtml}</div>`
      );
    }
  } else {
    // 如果没有操作按钮，删除空的acationArea div
    updatedContent = updatedContent.replace(
      /<div\s+id="acationArea"\s+class="z-page-action\s+z-btn-define">\s*<\/div>\s*/gi,
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

// ==================== 主函数 ====================

async function main() {
  // 定义处理路径
  const inputDir = path.join(__dirname, './dist/matched-jsp');
  const outputDir = path.join(__dirname, './dist/structure-output');

  try {
    // 确保输出目录存在
    ensureDirectoryExists(outputDir);

    // 获取所有JSP文件
    const jspFiles = getAllJspFiles(inputDir);
    
    if (jspFiles.length === 0) {
      console.log('未找到JSP文件！');
      return;
    }

    console.log(`找到 ${jspFiles.length} 个JSP文件，开始处理结构...`);
    
    // 创建一个Map来存储转换结果
    const processedFiles = new Map();

    // 处理每个JSP文件
    for (const filePath of jspFiles) {
      // 计算相对路径
      const relativePath = path.relative(inputDir, filePath);
      const outputPath = path.join(outputDir, relativePath);
      
      try {
        // 确保输出文件的目录结构存在
        ensureDirectoryExists(path.dirname(outputPath));

        // 读取并转换文件内容
        const originalContent = readFile(filePath);
        const transformedContent = transformJSPStructure(originalContent);
        
        // 写入转换后的文件
        writeFile(outputPath, transformedContent);
        
        // 记录处理结果
        processedFiles.set(relativePath, true);
        console.log(`✓ 已处理结构: ${relativePath}`);
      } catch (err) {
        console.error(`× 处理结构失败: ${relativePath}`, err.message);
        processedFiles.set(relativePath, false);
      }
    }

    // 输出处理结果统计
    const totalFiles = processedFiles.size;
    const successFiles = [...processedFiles.values()].filter(Boolean).length;
    
    console.log('\n结构处理完成！');
    console.log(`总文件数: ${totalFiles}`);
    console.log(`成功处理: ${successFiles}`);
    console.log(`失败数量: ${totalFiles - successFiles}`);
    console.log(`输出目录: ${outputDir}`);
    
  } catch (error) {
    console.error('处理过程中发生错误：', error);
  }
}

// 执行主函数
main();