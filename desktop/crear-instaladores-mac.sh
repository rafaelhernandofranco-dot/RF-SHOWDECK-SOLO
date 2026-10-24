#!/bin/bash
# Crea los instaladores de RF ShowKeys Solo (Mac Apple Silicon, Mac Intel y Windows) en el Escritorio.
# Se ejecuta en el Mac de Rafael:  bash crear-instaladores-mac.sh
set -e
V=33.2.1
NAME="RF ShowKeys Solo"
OUT="$HOME/Desktop/ShowKeys-Instaladores"
W=$(mktemp -d)
mkdir -p "$OUT"
cd "$W"
echo "1/4 Descargando la app…"
curl -fsSL -o src.zip https://github.com/rafaelhernandofranco-dot/RF-SHOWDECK-SOLO/archive/refs/heads/main.zip
unzip -q src.zip
SRC="$W/RF-SHOWDECK-SOLO-main"
echo "2/4 Descargando Electron $V (unos 300 MB)…"
for A in darwin-arm64 darwin-x64 win32-x64; do curl -fL# -o "e-$A.zip" "https://github.com/electron/electron/releases/download/v$V/electron-v$V-$A.zip"; done
echo "3/4 Armando el ícono…"
mkdir icon.iconset
for s in 16 32 128 256 512; do sips -z $s $s "$SRC/icon-512.png" --out "icon.iconset/icon_${s}x${s}.png" >/dev/null; d=$((s*2)); [ $d -le 512 ] && sips -z $d $d "$SRC/icon-512.png" --out "icon.iconset/icon_${s}x${s}@2x.png" >/dev/null; done
iconutil -c icns icon.iconset -o icon.icns
echo "4/4 Creando instaladores…"
for A in arm64 x64; do
  rm -rf "m$A"; mkdir "m$A"; (cd "m$A" && ditto -x -k "../e-darwin-$A.zip" .)
  APP="m$A/$NAME.app"; mv "m$A/Electron.app" "$APP"
  mkdir -p "$APP/Contents/Resources/app"; cp "$SRC/desktop/main.js" "$SRC/desktop/package.json" "$APP/Contents/Resources/app/"
  cp icon.icns "$APP/Contents/Resources/electron.icns"
  P="$APP/Contents/Info.plist"
  plutil -replace CFBundleName -string "$NAME" "$P"; plutil -replace CFBundleDisplayName -string "$NAME" "$P"
  plutil -replace CFBundleIdentifier -string "com.rfaudiopro.showdeck.solo" "$P"
  plutil -replace CFBundleShortVersionString -string "1.0.0" "$P"
  xattr -cr "$APP"; codesign --force --deep -s - "$APP" 2>/dev/null
  T=$([ $A = arm64 ] && echo "Mac-AppleSilicon" || echo "Mac-Intel")
  rm -f "$OUT/RF-ShowKeys-Solo-$T.zip"; (cd "m$A" && ditto -c -k --keepParent "$NAME.app" "$OUT/RF-ShowKeys-Solo-$T.zip")
done
rm -rf win; mkdir -p "win/$NAME"; (cd "win/$NAME" && unzip -q "../../e-win32-x64.zip")
mv "win/$NAME/electron.exe" "win/$NAME/$NAME.exe"
mkdir -p "win/$NAME/resources/app"; cp "$SRC/desktop/main.js" "$SRC/desktop/package.json" "win/$NAME/resources/app/"
rm -f "$OUT/RF-ShowKeys-Solo-Windows.zip"; (cd win && zip -qry "$OUT/RF-ShowKeys-Solo-Windows.zip" "$NAME")
cp "$SRC/desktop/LEEME.txt" "$OUT/LEEME.txt"
rm -rf "$W"
echo ""; echo "LISTO: los instaladores están en el Escritorio, carpeta ShowKeys-Instaladores"; open "$OUT"
