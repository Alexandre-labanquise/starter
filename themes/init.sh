CHROME_VERSION=${CHROME_VERSION:-111}
export CHROME_VERSION_MAIN=${CHROME_VERSION}

apt update && apt install -y unzip wget
wget "https://chromedriver.storage.googleapis.com/LATEST_RELEASE_${CHROME_VERSION}" -O chrome_version
wget "https://chromedriver.storage.googleapis.com/$(cat chrome_version)/chromedriver_linux64.zip" \
    && unzip -o chromedriver_linux64.zip
wget "https://dl.google.com/linux/chrome/deb/pool/main/g/google-chrome-stable/google-chrome-stable_$(cat chrome_version)-1_amd64.deb" \
    -O google-chrome-stable.deb

apt update && apt -y install libpq-dev gcc ./google-chrome-stable.deb
rm -rf google-chrome-stable.deb
chmod +x chromedriver

pip install pipx
