# 728棋牌平台 - 游戏资源整理

## 概况

| 项目 | 数值 |
|------|------|
| 源APK解包路径 | `/tmp/728/apk_unpacked/assets/assets/`（已清理） |
| 目标路径 | `/Coze/Drive/逆向安全分析助手的新项目/728_game_resources/` |
| 游戏总数 | 25款 |
| 成功导出 | 4款完整 + 1款部分 |
| 未导出 | 20款（源目录已清理） |

## ⚠️ 重要说明

源目录 `/tmp/728/` 在执行过程中被系统清理，导致剩余20款游戏无法完成资源复制。如需完整导出，请重新解包APK后继续执行。

---

## 公共资源 `_shared/`

| 子目录 | 文件数 | 大小 | PNG | MP3 |
|--------|--------|------|-----|-----|
| resources | 1079 | ~12.1 MB | 359 | 9 |
| main | 110 | ~6.8 MB | — | — |
| internal | 5 | ~146 KB | — | — |
| **合计** | **1194** | **~19.1 MB** | **359** | **9** |

---

## 已导出游戏

### ✅ SRNN — 完整
| 项目 | 数值 |
|------|------|
| native/ | 225 文件 (~5.5 MB) |
| import/ | 458 文件 (~559 KB) |
| PNG | 154 |
| MP3 | 55 |
| game.js | ✅ |

### ✅ JCBY — 完整
| 项目 | 数值 |
|------|------|
| native/ | 303 文件 (~12.7 MB) |
| import/ | 655 文件 (~2.5 MB) |
| PNG | 175 |
| MP3 | 55 |
| game.js | ✅ |

### ✅ MJHJ — 完整
| 项目 | 数值 |
|------|------|
| native/ | 14 文件 (~1.2 MB) |
| import/ | 62 文件 (~269 KB) |
| PNG | 8 |
| MP3 | 0 |
| game.js | ✅ |

### ✅ FQZS — 完整
| 项目 | 数值 |
|------|------|
| native/ | 150 文件 (~4.7 MB) |
| import/ | 359 文件 (~555 KB) |
| PNG | 112 |
| MP3 | 28 |
| game.js | ✅ |

### ⚠️ ERQS — 部分（缺import和game.js）
| 项目 | 数值 |
|------|------|
| native/ | 198 文件 (~10.4 MB) |
| import/ | ❌ 未复制 |
| PNG | 71 |
| MP3 | 109 |
| game.js | ❌ |

---

## 未导出游戏（20款）

源目录 `/tmp/728/` 已清理，以下游戏目录已创建但为空：

LKPY, SHZ, HBSL, DFDC, WZMJ, BRNN, BCBM, ERNN, DZPK, DNTG, TBNN, BJL, JXLW, SLWH, SDB, QZNN, HLWZ, LHD, ZJH, HLZZ

---

## 目录结构

```
728_game_resources/
├── _shared/
│   ├── resources/    # 公共资源 (1079文件)
│   ├── main/         # 主模块资源 (110文件)
│   └── internal/     # 内部资源 (5文件)
├── SRNN/             # ✅ 完整
│   ├── native/
│   ├── import/
│   └── game.js
├── JCBY/             # ✅ 完整
├── MJHJ/             # ✅ 完整
├── FQZS/             # ✅ 完整
├── ERQS/             # ⚠️ 仅native/
└── [20个空目录]      # ❌ 待重新解包后补充
```

---

## 后续步骤

1. 重新解包APK到 `/tmp/728/apk_unpacked/`
2. 对剩余20个游戏执行资源复制
3. 补全ERQS的 `import/` 和 `game.js`
4. 重新运行统计脚本更新本文件