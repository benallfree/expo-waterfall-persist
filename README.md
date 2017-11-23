# <RepoName>

`<PackageName` is <PackageIs>

<PackageLongDescription>

```
npm install <PackageNpm>
```

# Features

* Feature 1
* Feature 2

# Developing this Package

## Watchman Configuration

In order to use `<PackageName>` in your project while also developing it:

```bash
cd /my/local/spot
git clone git@github.com:<RepoUser>/<RepoName>.git <RepoName>
brew uninstall watchman
brew update && brew upgrade
brew install --HEAD watchman
npm i -g wml
wml add <src> <dst>
wml list
wml start
```