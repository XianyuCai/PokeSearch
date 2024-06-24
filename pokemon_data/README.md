```markdown
# Pokemon数据工具

这个文件夹包含了与宝可梦数据相关的工具和数据文件。

## 文件说明

- `poke_name_scraper.py`: 用于从PokeAPI爬取宝可梦中英文名称的Python脚本。
- `pokemon_names_zh_en.txt`: 包含宝可梦中英文名称对照的数据文件。

## 使用方法

1. 确保已安装必要的Python库：
   ```
   pip install requests
   ```

2. 运行爬虫脚本：
   ```
   python poke_name_scraper.py
   ```

3. 脚本会生成或更新 `pokemon_names_zh_en.txt` 文件。

## 注意事项

- 请遵守PokeAPI的使用条款和限制。
- 数据更新频率：根据项目需求定期运行脚本以更新数据。


