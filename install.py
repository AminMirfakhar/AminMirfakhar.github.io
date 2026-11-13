#!/usr/bin/env python3
"""Install portfolio update safely onto engineering-redesign branch."""
from pathlib import Path
import sys, subprocess, shutil, datetime
root=Path(sys.argv[1] if len(sys.argv)>1 else '.').resolve()
src=Path(__file__).resolve().parent
if not (root/'_config.yml').is_file():
    sys.exit('ERROR: target does not contain _config.yml; run from repository root.')
p=subprocess.run(['git','branch','--show-current'],cwd=root,text=True,capture_output=True)
branch=p.stdout.strip()
if branch!='engineering-redesign':
    sys.exit('ERROR: current Git branch is %r. Switch to engineering-redesign before installing.'%branch)
relfiles=[p.relative_to(src) for base in ('_data','_pages','_includes','assets') for p in (src/base).rglob('*') if p.is_file()]
backup=Path('/tmp')/('amin-portfolio-backup-'+datetime.datetime.now().strftime('%Y%m%d-%H%M%S'))
changed=0
for rel in relfiles:
    target=root/rel
    if target.is_file():
        old=backup/rel;old.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(target,old)
    target.parent.mkdir(parents=True,exist_ok=True)
    shutil.copy2(src/rel,target)
    changed+=1
print('Installed',changed,'files; existing files backed up at',backup)
project_pages=list((root/'_pages/projects').glob('*.md'))
required=('hexapod','drywall','dm45-drill','pipeline-inspection','pellet-sizing','conveyor','parallel-robot','continuum-arm','rock-breaker','racing-simulator','camera-housing','fdm-printers')
missing=[n for n in required if not (root/'_pages/projects'/f'{n}.md').is_file()]
if missing:sys.exit('ERROR: Missing project detail pages: '+','.join(missing))
print('Verified all 12 expected project pages.')
print('Check _pages/projects.md for `am-catalog` and `data-project-card`.')
print('Next: bundle exec jekyll build and serve on port 4000.')
print('IMPORTANT: verify results before git add/commit. Do not stage .venv, vendor/bundle or the ZIP.')
