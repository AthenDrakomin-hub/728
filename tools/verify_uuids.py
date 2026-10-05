#!/usr/bin/env python3
"""
资源UUID校验工具 — 校验728-games重建资源的UUID有效性
检查: .meta文件存在性、UUID格式、uuid_map.json一致性、资源文件完整性
用法: python tools/verify_uuids.py
"""
import json
import os
import re
import sys
from pathlib import Path

UUID_RE = re.compile(r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')

def find_project_root():
    """查找项目根目录"""
    script_dir = Path(__file__).parent
    # tools/ -> 728/
    return script_dir.parent

def verify_meta_file(meta_path: Path) -> dict:
    """校验单个.meta文件"""
    result = {"path": str(meta_path), "valid": True, "errors": []}
    try:
        with open(meta_path, 'r', encoding='utf-8') as f:
            meta = json.load(f)
        uuid_val = meta.get('uuid', '')
        if not uuid_val:
            result['errors'].append('缺少uuid字段')
            result['valid'] = False
        elif not UUID_RE.match(uuid_val):
            result['errors'].append(f'UUID格式无效: {uuid_val}')
            result['valid'] = False
        # 检查对应资源文件是否存在
        resource_path = meta_path.with_suffix('')
        if not resource_path.exists():
            result['errors'].append(f'对应资源文件不存在: {resource_path.name}')
            result['valid'] = False
    except json.JSONDecodeError as e:
        result['errors'].append(f'JSON解析失败: {e}')
        result['valid'] = False
    except Exception as e:
        result['errors'].append(f'读取失败: {e}')
        result['valid'] = False
    return result

def main():
    root = find_project_root()
    games_dir = root / '728_original' / 'client' / 'cocos-project' / 'assets' / 'resources' / '728-games'
    uuid_map_path = games_dir / 'uuid_map.json'

    print(f"=== 728 资源UUID校验 ===")
    print(f"资源目录: {games_dir}")
    print()

    if not games_dir.exists():
        print(f"错误: 资源目录不存在: {games_dir}")
        sys.exit(1)

    # 1. 统计游戏目录
    game_dirs = [d for d in games_dir.iterdir() if d.is_dir()]
    print(f"游戏目录数: {len(game_dirs)}")

    # 2. 校验所有.meta文件
    all_meta = list(games_dir.rglob('*.meta'))
    print(f".meta文件总数: {len(all_meta)}")

    valid_count = 0
    invalid_files = []
    uuid_set = set()
    duplicate_uuids = []

    for meta_path in all_meta:
        result = verify_meta_file(meta_path)
        if result['valid']:
            valid_count += 1
            # 检查UUID重复
            try:
                with open(meta_path, 'r', encoding='utf-8') as f:
                    uuid_val = json.load(f).get('uuid', '')
                if uuid_val in uuid_set:
                    duplicate_uuids.append(uuid_val)
                uuid_set.add(uuid_val)
            except:
                pass
        else:
            invalid_files.append(result)

    print(f"有效.meta文件: {valid_count}")
    print(f"无效.meta文件: {len(invalid_files)}")
    if invalid_files:
        print("\n无效文件详情:")
        for r in invalid_files[:10]:
            print(f"  {r['path']}: {', '.join(r['errors'])}")
        if len(invalid_files) > 10:
            print(f"  ... 还有 {len(invalid_files) - 10} 个")

    print(f"\n唯一UUID数: {len(uuid_set)}")
    print(f"重复UUID数: {len(duplicate_uuids)}")
    if duplicate_uuids:
        print(f"重复UUID: {duplicate_uuids[:5]}")

    # 3. 校验uuid_map.json
    if uuid_map_path.exists():
        with open(uuid_map_path, 'r', encoding='utf-8') as f:
            uuid_map = json.load(f)
        print(f"\nuuid_map.json条目数: {len(uuid_map)}")
        # 检查map中的UUID是否都在.meta文件中
        map_uuids = set(uuid_map.values()) if isinstance(list(uuid_map.values())[0], str) else set()
        if map_uuids:
            missing_in_meta = map_uuids - uuid_set
            print(f"map中但.meta缺失的UUID: {len(missing_in_meta)}")
    else:
        print(f"\n警告: uuid_map.json不存在: {uuid_map_path}")

    # 4. 总结
    print("\n=== 校验总结 ===")
    total_issues = len(invalid_files) + len(duplicate_uuids)
    if total_issues == 0:
        print("全部通过! 资源UUID有效。")
        sys.exit(0)
    else:
        print(f"发现 {total_issues} 个问题，需要修复。")
        sys.exit(1)

if __name__ == '__main__':
    main()
