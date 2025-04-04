# AI 脚本实现
批量jsp样式转化
参演: Claude-3.7-Sonnet

## 提交命名规范

### 分支命名
- 功能分支: `feature/功能名称`
- 修复分支: `fix/问题描述`
- 优化分支: `optimize/优化内容`
- 重构分支: `refactor/重构内容`

### 提交信息格式
提交信息应遵循以下格式:

#### 类型
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码风格调整，不影响代码功能
- `refactor`: 代码重构，既不是新增功能也不是修复bug
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

#### 范围
可选，表示修改影响的范围，如 `init`, `structure`, `ui` 等

#### 主题
简短描述，不超过50个字符

#### 详细描述
可选，详细说明本次提交的内容和原因

### 示例

### 文件命名规范
- 源文件: 使用小驼峰命名法，如 `initScript.js`
- 配置文件: 使用全小写，如 `config.json`
- 备份文件: 添加 `-old` 后缀，如 `index-old.jsp`