# Maintainer: sam <sampyeatt4@proton.me>
pkgname=ProjectTracker
pkgver=0.2.0
pkgrel=1
pkgdesc="Project tracker application"
arch=('x86_64' 'aarch64')
url="https://github.com/sampyeatt/ProjectTracker"
license=('MIT')
depends=('webkit2gtk-4.1' 'libayatana-appindicator' 'librsvg')
install=${pkgname}.install
source_x86_64=("${url}/releases/download/app-v${pkgver}/projecttracker_${pkgver}_amd64.deb")
# source_x86_64=("${url}/releases/download/app-v${pkgver}/projecttracker_${pkgver}_arm64.deb")
sha256sums_x86_64=('f244b96833ff71e1c9211189948c421c364bcff556adbb209260a9ed43144ad5')
# sha256sums_aarch64=('eb8a2bcab7537a31390751c8e061e7e977200a9767dcd36c51dd78038a4b8235')


package() {
    tar -xvf data.tar.gz -C "${pkgdir}"
}
