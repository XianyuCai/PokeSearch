# pokeSearch 项目日志

## 2024.6.23
### 当前功能
- 用户可在搜索框输入宝可梦英文名
- 通过 PokeAPI 获取并显示对应宝可梦的正面图片

### 计划实现
1. 添加逻辑以应对 API 请求失败或找不到宝可梦的情况
2. 在用户输入时提供实时建议
3. 增加多语言搜索支持（仅部分实现）

## 2024.6.24
### 功能更新
- 实现了通过"Enter"键触发搜索功能

### 遇到的问题
1. CORS 政策阻止了对百度翻译 API 的请求

<details>
<summary>错误信息和解决方案</summary>

#### 错误信息
```
Access to fetch at 'https://fanyi-api.baidu.com/api/trans/vip/translate?q=pikachu&from=auto&to=en&appid=20240624002083782&salt=gs4k&sign=997bf1353d513b4087f3eb6e3b04114d' from origin 'http://localhost:5173' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

#### 原因分析
通过Google搜索：百度 API 服务器未设置允许来自本地开发服务器（localhost:5173）的跨域请求，这是一种常见的安全限制。

#### 解决方案（AI生成）
在 Vite 配置文件（vite.config.js）中设置代理服务器：

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://fanyi-api.baidu.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```
</details>

2. 翻译准确性问题
   解决 CORS 问题后，发现翻译功能无法准确将所有宝可梦名称翻译成正确的英文名。

### 多语言搜索尝试
- 使用 Python 爬虫从 PokeAPI 导出中英文对照到 pokemon_names_zh_en.txt 文件
- 发现百度翻译的术语翻译库限制：
  - 相同源语言及目标语言只能创建一个术语库
  - 每个术语库最多包含 500 条记录
  - 只支持中文到英文的翻译

### 当前状态
目前只能用中文搜索宝可梦图鉴前 500 的大部分宝可梦。

### 今日收获
- 第一次知道跨域资源共享（CORS）的安全问题
- 提升了 API 应用能力
- 增进了对网络爬虫的了解

## 2024.6.25
### 功能更新
- 实现了跨语言搜索宝可梦的功能
- 现可通过宝可梦编号搜索
- 通过预先获取并本地存储 PokeAPI 的数据，优化了搜索过程

### 实现方法
1. 数据获取和存储：
   - 从 PokeAPI 获取所有宝可梦的详细信息
   - 将获取的数据保存到浏览器的本地存储（Local Storage）中

2. 搜索优化：
   - 用户输入搜索内容时，直接与本地存储的数据进行比对
   - 通过字符串匹配找到对应的宝可梦 ID

### 性能改进
- 减少了对 PokeAPI 的重复请求
- 显著提高了搜索响应速度

### 新掌握的知识
- 本地存储（Local Storage）的使用方法和优势：
  - 可以在用户的浏览器中持久化存储数据
  - 减少了对服务器的请求次数
  - 提高了应用的响应速度和离线功能

### 反思
- 对 PokeAPI 数据结构的不熟悉导致了解决问题的延迟
- 认识到深入了解使用的 API 结构的重要性，这可以大大加快问题解决的速度

### 未解决问题：
- 当有一次搜索不合规以后，跳出来的错误信息会一直在
