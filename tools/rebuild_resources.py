#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
728游戏资源重建工具
扫描 728_game_resources/{GAME}/import 和 native 目录,
生成 Cocos Creator 2.x .meta 文件, 重建资源到客户端项目。

用法:
  python rebuild_resources.py --game BCBM --output ../client/cocos-project/assets/resources/728-games/
  python rebuild_resources.py --all --output ../client/cocos-project/assets/resources/728-games/
"""

import os
import sys
import json
import uuid
import shutil
import argparse
from pathlib import Path
from collections import defaultdict


def generate_uuid():
    """生成Cocos格式UUID (带连字符)"""
    return str(uuid.uuid4())


def make_meta(uuid_str, asset_type="", extra=None):
    """生成Cocos Creator 2.x .meta文件内容"""
    meta = {
        "ver": "1.0.0",
        "uuid": uuid_str,
        "isPlugin": False,
        "loadPluginInWeb": True,
        "loadPluginInNative": True,
        "loadPluginInEditor": True,
        "subMetas": {},
        "userData": {}
    }
    if asset_type:
        meta["type"] = asset_type
    if extra:
        meta.update(extra)
    return meta


def make_texture_meta(uuid_str, width=0, height=0):
    """生成图片纹理.meta"""
    sub_uuid = generate_uuid()
    return {
        "ver": "1.0.0",
        "uuid": uuid_str,
        "type": "sprite",
        "wrapMode": "clamp",
        "filterMode": "bilinear",
        "subMetas": {
            "img": {
                "ver": "1.0.0",
                "uuid": sub_uuid,
                "rawTextureUuid": uuid_str,
                "trimType": "auto",
                "trimThreshold": 1,
                "rotated": False,
                "offsetX": 0,
                "offsetY": 0,
                "trimX": 0,
                "trimY": 0,
                "width": width,
                "height": height,
                "rawWidth": width,
                "rawHeight": height,
                "borderTop": 0,
                "borderBottom": 0,
                "borderLeft": 0,
                "borderRight": 0,
                "subMetas": {}
            }
        }
    }


def parse_import_json(filepath):
    """解析Cocos import JSON, 提取资源信息"""
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        return None

    if not isinstance(data, list) or len(data) < 4:
        return None

    # Cocos序列化格式: [version, [uuids], ?, [type_defs], [data], ...]
    uuids = data[1] if isinstance(data[1], list) else []
    type_defs = data[3] if isinstance(data[3], list) else []
    raw_data = data[4] if len(data) > 4 else []

    # 提取资源类型
    asset_type = "unknown"
    asset_name = ""
    for td in type_defs:
        if isinstance(td, list) and len(td) >= 2:
            if isinstance(td[0], str) and "." in td[0]:
                asset_type = td[0]
                break

    # 提取名称 (通常在data的_name字段)
    def find_name(obj):
        if isinstance(obj, dict):
            if "_name" in obj and isinstance(obj["_name"], str):
                return obj["_name"]
            if "name" in obj and isinstance(obj["name"], str):
                return obj["name"]
            for v in obj.values():
                n = find_name(v)
                if n:
                    return n
        elif isinstance(obj, list):
            for item in obj:
                n = find_name(item)
                if n:
                    return n
        return ""

    asset_name = find_name(raw_data)

    return {
        "uuid": Path(filepath).stem,  # 文件名(无扩展名)即UUID
        "type": asset_type,
        "name": asset_name,
        "uuids": uuids,
        "import_path": str(filepath),
        "raw": data,
    }


def scan_game_resources(game_dir):
    """扫描单款游戏的import和native目录"""
    import_dir = Path(game_dir) / "import"
    native_dir = Path(game_dir) / "native"
    game_js = Path(game_dir) / "game.js"

    resources = {
        "imports": [],      # import资源列表
        "natives": [],      # native资源列表
        "uuid_map": {},     # UUID -> {type, name, import_path, native_path}
        "game_js": str(game_js) if game_js.exists() else "",
        "stats": {"import_count": 0, "native_count": 0, "types": defaultdict(int)},
    }

    # 扫描import
    if import_dir.exists():
        for json_file in import_dir.rglob("*.json"):
            info = parse_import_json(str(json_file))
            if info:
                resources["imports"].append(info)
                resources["uuid_map"][info["uuid"]] = {
                    "type": info["type"],
                    "name": info["name"],
                    "import_path": str(json_file),
                    "native_path": "",
                }
                resources["stats"]["types"][info["type"]] += 1
                resources["stats"]["import_count"] += 1

    # 扫描native
    if native_dir.exists():
        for native_file in native_dir.rglob("*"):
            if native_file.is_file():
                file_uuid = native_file.stem
                ext = native_file.suffix.lower()
                resources["natives"].append({
                    "uuid": file_uuid,
                    "ext": ext,
                    "path": str(native_file),
                })
                resources["stats"]["native_count"] += 1
                if file_uuid in resources["uuid_map"]:
                    resources["uuid_map"][file_uuid]["native_path"] = str(native_file)
                else:
                    resources["uuid_map"][file_uuid] = {
                        "type": f"native{ext}",
                        "name": file_uuid[:8],
                        "import_path": "",
                        "native_path": str(native_file),
                    }

    return resources


def rebuild_game(game_name, game_dir, output_base):
    """重建单款游戏资源到输出目录"""
    print(f"\n{'='*60}")
    print(f"重建游戏: {game_name}")
    print(f"源目录: {game_dir}")
    print(f"{'='*60}")

    resources = scan_game_resources(game_dir)
    stats = resources["stats"]

    print(f"  import资源: {stats['import_count']}")
    print(f"  native资源: {stats['native_count']}")
    print(f"  资源类型分布:")
    for t, c in sorted(stats["types"].items(), key=lambda x: -x[1]):
        print(f"    {t}: {c}")

    # 创建输出目录
    game_output = Path(output_base) / game_name
    import_output = game_output / "import"
    native_output = game_output / "native"
    import_output.mkdir(parents=True, exist_ok=True)
    native_output.mkdir(parents=True, exist_ok=True)

    # 1. 复制import JSON并生成.meta
    for imp in resources["imports"]:
        src = Path(imp["import_path"])
        # 保持目录结构 (import/XX/uuid.json)
        sub_dir = src.parent.name  # XX
        dst_dir = import_output / sub_dir
        dst_dir.mkdir(parents=True, exist_ok=True)
        dst = dst_dir / src.name

        shutil.copy2(str(src), str(dst))

        # 生成.json.meta
        meta = make_meta(imp["uuid"], asset_type=imp["type"])
        with open(str(dst) + ".meta", "w", encoding="utf-8") as f:
            json.dump(meta, f, indent=2, ensure_ascii=False)

    # 2. 复制native资源并生成.meta
    for nat in resources["natives"]:
        src = Path(nat["path"])
        sub_dir = src.parent.name
        dst_dir = native_output / sub_dir
        dst_dir.mkdir(parents=True, exist_ok=True)
        dst = dst_dir / src.name

        shutil.copy2(str(src), str(dst))

        # 图片生成纹理.meta, 其他生成普通.meta
        if nat["ext"] in (".png", ".jpg", ".jpeg", ".webp"):
            meta = make_texture_meta(nat["uuid"])
        else:
            meta = make_meta(nat["uuid"])
        with open(str(dst) + ".meta", "w", encoding="utf-8") as f:
            json.dump(meta, f, indent=2, ensure_ascii=False)

    # 3. 复制game.js
    if resources["game_js"]:
        shutil.copy2(resources["game_js"], str(game_output / "game.js"))
        meta = make_meta(generate_uuid(), asset_type="javascript")
        with open(str(game_output / "game.js.meta"), "w", encoding="utf-8") as f:
            json.dump(meta, f, indent=2, ensure_ascii=False)

    # 4. 生成目录.meta
    for d in [game_output, import_output, native_output]:
        meta = make_meta(generate_uuid())
        with open(str(d) + ".meta", "w", encoding="utf-8") as f:
            json.dump(meta, f, indent=2, ensure_ascii=False)

    # 5. 输出UUID映射表
    uuid_map_path = game_output / "uuid_map.json"
    with open(str(uuid_map_path), "w", encoding="utf-8") as f:
        json.dump(resources["uuid_map"], f, indent=2, ensure_ascii=False)

    print(f"  输出目录: {game_output}")
    print(f"  UUID映射: {uuid_map_path}")
    print(f"  重建完成!")

    return resources


def main():
    parser = argparse.ArgumentParser(description="728游戏资源重建工具")
    parser.add_argument("--game", type=str, help="单款游戏代号 (如 BCBM)")
    parser.add_argument("--all", action="store_true", help="重建全部26款游戏")
    parser.add_argument("--resources-dir", type=str,
                        default=str(Path(__file__).parent.parent / "728_game_resources"),
                        help="728_game_resources目录路径")
    parser.add_argument("--output", type=str,
                        default=str(Path(__file__).parent.parent / "728_original" / "client" / "cocos-project" / "assets" / "resources" / "728-games"),
                        help="输出目录")
    args = parser.parse_args()

    resources_dir = Path(args.resources_dir)
    output_dir = Path(args.output)

    if not resources_dir.exists():
        print(f"错误: 资源目录不存在: {resources_dir}")
        sys.exit(1)

    output_dir.mkdir(parents=True, exist_ok=True)

    # 生成输出根目录.meta
    root_meta = make_meta(generate_uuid())
    with open(str(output_dir) + ".meta", "w", encoding="utf-8") as f:
        json.dump(root_meta, f, indent=2, ensure_ascii=False)

    games_to_rebuild = []
    if args.all:
        for d in sorted(resources_dir.iterdir()):
            if d.is_dir() and (d / "import").exists():
                games_to_rebuild.append(d.name)
    elif args.game:
        game_dir = resources_dir / args.game
        if not game_dir.exists():
            print(f"错误: 游戏目录不存在: {game_dir}")
            sys.exit(1)
        games_to_rebuild.append(args.game)
    else:
        parser.print_help()
        print("\n示例:")
        print("  python rebuild_resources.py --game BCBM")
        print("  python rebuild_resources.py --all")
        sys.exit(0)

    print(f"待重建游戏: {len(games_to_rebuild)} 款")
    print(f"输出目录: {output_dir}")

    total_imports = 0
    total_natives = 0
    for game_name in games_to_rebuild:
        game_dir = resources_dir / game_name
        result = rebuild_game(game_name, game_dir, output_dir)
        total_imports += result["stats"]["import_count"]
        total_natives += result["stats"]["native_count"]

    print(f"\n{'='*60}")
    print(f"全部重建完成!")
    print(f"  游戏数量: {len(games_to_rebuild)}")
    print(f"  import资源: {total_imports}")
    print(f"  native资源: {total_natives}")
    print(f"  输出目录: {output_dir}")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
