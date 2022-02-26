import os
import shutil
from enum import Enum
import zipfile
import argparse


class GameTypes(Enum):
    MV = 0
    MZ = 1


class CheatPaths:
    def __init__(self, root_dir):
        self.root_dir = root_dir
        self.cheat_dir = 'cheat'
        self.js_dir = 'js'
        self.initialize_dir = '_cheat_initialize'
        self.initialize_game_type_dirs = {
            GameTypes.MV: 'mv',
            GameTypes.MZ: 'mz'
        }

    def get_cheat_source_path(self):
        return os.path.join(self.root_dir, self.cheat_dir)

    def get_js_source_path(self):
        return os.path.join(self.root_dir, self.js_dir)

    def get_initialize_path(self, game_type=None):
        if game_type is None:
            return os.path.join(self.root_dir, self.initialize_dir)

        return os.path.join(self.root_dir, self.initialize_dir, self.initialize_game_type_dirs[game_type])


class Paths:
    def __init__(self):
        self.temp_root_path = 'tmp'

        self.origin = CheatPaths('../cheat-engine/www')
        self.temp = CheatPaths(os.path.join(self.temp_root_path, 'www'))

        self.deploy_output_dir = 'output'
        self.output_files = {
            GameTypes.MV: 'rpg-mv-cheat-{}',
            GameTypes.MZ: 'rpg-mz-cheat-{}'
        }

    def get_output_file_path(self, game_type, version):
        return os.path.join(self.deploy_output_dir, self.output_files[game_type]).format(version)


def merge_directory(src, dest, inplace=True):
    if not os.path.exists(dest) and not os.path.isdir(dest):
        os.makedirs(dest, exist_ok=True)

    files = [os.path.join(src, file) for file in os.listdir(src)]

    dirs = [file for file in files if os.path.isdir(file)]
    files = [file for file in files if os.path.isfile(file)]

    for src_file in files:
        file_name = os.path.basename(src_file)
        dest_file = os.path.join(dest, file_name)

        # do not copy if not inplace mode and file exists in dest directory
        if not inplace and os.path.exists(dest) and os.path.isfile(dest_file):
            continue

        print(f'{src_file}  ->  {dest_file}')
        shutil.copy2(src_file, dest_file)

    for src_dir in dirs:
        dir_name = os.path.basename(src_dir)
        dest_dir = os.path.join(dest, dir_name)

        merge_directory(src_dir, dest_dir, inplace)


if __name__ == '__main__':
    # parse args
    parser = argparse.ArgumentParser(description='RPG Maker MV/MZ cheat deploy maker')
    parser.add_argument('--version', required=True, type=str, help='version of deployment')
    args = parser.parse_args()

    paths = Paths()

    for game_type in GameTypes:
        # copy js sources to temp directory
        shutil.copytree(paths.origin.root_dir, paths.temp.root_dir)

        # merge cheat sources
        merge_directory(
            os.path.join(paths.temp.get_initialize_path(game_type), os.path.basename(paths.temp.get_cheat_source_path())),
            paths.temp.get_cheat_source_path())

        # copy js
        shutil.copytree(
            os.path.join(paths.temp.get_initialize_path(game_type), os.path.basename(paths.temp.get_js_source_path())),
            paths.temp.get_js_source_path())

        # remove initialize path
        shutil.rmtree(paths.temp.get_initialize_path())

        # compress to zip file
        shutil.rmtree(os.path.join(paths.temp.root_dir, '.idea'))
        shutil.make_archive(paths.get_output_file_path(game_type, args.version), 'zip', paths.temp.root_dir)

        # remove temp directory
        shutil.rmtree(paths.temp_root_path)