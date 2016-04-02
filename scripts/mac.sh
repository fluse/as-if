xcode-select --install

ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

brew update

brew doctor

export PATH="/usr/local/bin:$PATH"

brew install cask

brew cask install iterm2

brew cask install google-chrome

brew cask install atom

brew install node

brew install mongodb
