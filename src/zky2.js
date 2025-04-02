const fs = require('fs');
const path = require('path');

// 基础文件操作函数
function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}

function getJspFiles(dirPath) {
  return fs.readdirSync(dirPath)
    .filter(file => file.toLowerCase().endsWith('.jsp'))
    .map(file => path.join(dirPath, file));
}

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// 递归获取所有JSP文件
function getAllJspFiles(dirPath, fileList = []) {
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      getAllJspFiles(filePath, fileList);
    } else if (file.toLowerCase().endsWith('.jsp')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function transformJSP(content) {
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

// 主函数
async function main() {
  const inputDir = path.join(__dirname, 'dist/output');
  const outputDir = path.join(__dirname, 'dist/output-2');

  try {
    ensureDirectoryExists(outputDir);
    const jspFiles = getAllJspFiles(inputDir);
    
    if (jspFiles.length === 0) {
      console.log('未找到JSP文件！');
      return;
    }

    for (const filePath of jspFiles) {
      // 计算相对路径以保持目录结构
      const relativePath = path.relative(inputDir, filePath);
      const outputPath = path.join(outputDir, relativePath);
      const outputDirName = path.dirname(outputPath);
      
      // 确保输出目录存在
      ensureDirectoryExists(outputDirName);

      const oldContent = readFile(filePath);
      const transformedContent = transformJSP(oldContent);
      writeFile(outputPath, transformedContent);
      
      console.log(`已转换文件：${relativePath}`);
    }
    
    console.log('\n转换完成！输出目录：', outputDir);
  } catch (error) {
    console.error('发生错误：', error);
  }
}

main();
