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
function getAllJspFiles(dirPath) {
  const files = fs.readdirSync(dirPath);
  let jspFiles = [];
  
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      jspFiles = jspFiles.concat(getAllJspFiles(fullPath));
    } else if (file.toLowerCase().endsWith('.jsp')) {
      jspFiles.push(fullPath);
    }
  }
  
  return jspFiles;
}

function transformJSP(content) {
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

// 主函数
async function main() {
  const inputDir = path.join(__dirname, 'dist/output-2');
  const outputDir = path.join(__dirname, 'dist/output-3');

  try {
    ensureDirectoryExists(outputDir);
    const jspFiles = getAllJspFiles(inputDir);
    
    if (jspFiles.length === 0) {
      console.log('未找到JSP文件！');
      return;
    }

    for (const filePath of jspFiles) {
      // 计算相对路径，以保持目录结构
      const relativePath = path.relative(inputDir, filePath);
      const outputPath = path.join(outputDir, relativePath);
      
      // 确保目标目录存在
      ensureDirectoryExists(path.dirname(outputPath));

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
