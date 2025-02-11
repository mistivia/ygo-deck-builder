import json

def split_file(input_filename):
    chunk_size = 102400  # 100kB
    part_number = 1
    parts = []
    with open(input_filename, 'rb') as input_file:
        while True:
            data = input_file.read(chunk_size)
            if not data:
                break
            output_filename = f'card_db_parts/part{part_number}'
            with open(output_filename, 'wb') as output_file:
                output_file.write(data)
            parts.append(f'part{part_number}')
            part_number += 1
        with open("card_db_parts/index.json", 'w') as fp:
            fp.write(json.dumps(parts))
    print(f"file splited to {part_number-1} parts")

# 示例用法
split_file('card_db.json')
