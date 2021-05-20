function filesInDirectory(dir) {
    return new Promise((resolve) =>
        dir.createReader().readEntries((entries) =>
            Promise.all(
                entries
                    .filter((e) => e.name[0] !== ".")
                    .map((e) => (e.isDirectory ? filesInDirectory(e) : new Promise((resolve) => e.file(resolve))))
            )
                .then((files) => [].concat(...files))
                .then(resolve)
        )
    );
}

async function timestampForFilesInDirectory(dir) {
    const files = await filesInDirectory(dir);
    return files.map((f) => f.name + f.lastModifiedDate).join();
}

function reload() {
    console.log("%cReloading extension", "color: cyan; font-size: 25px");
    chrome.runtime.reload();
    // chrome.tabs.query ({ active: true, currentWindow: true }, tabs => { // NB: see https://github.com/xpl/crx-hotreload/issues/5
    //     if (tabs[0]) { chrome.tabs.reload (tabs[0].id) }
    //     chrome.runtime.reload ()
    // })
}

async function watchChanges(dir, lastTimestamp) {
    const timestamp = await timestampForFilesInDirectory(dir);
    if (!lastTimestamp || lastTimestamp === timestamp) {
        setTimeout(() => watchChanges(dir, timestamp), 1000); // retry after 1s
    } else {
        reload();
    }
}

chrome.management.getSelf((self) => {
    if (self.installType === "development") {
        chrome.runtime.getPackageDirectoryEntry((dir) => watchChanges(dir));
    }
});
