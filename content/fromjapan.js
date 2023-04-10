async function fromjapan() {
    console.log('┣ Start fromjapan script');

    let items = await chrome.storage.local.get(['fromjapan_view', 'fromjapan_refresh']);
    let isView = items['fromjapan_view'] || false;
    let isRefresh = items['fromjapan_refresh'] || false;

    /****************/
    /* style toggle */
    var timer;
    const isMercari = (!!window.location.href.indexOf('mercari')) || false;
    const initialTimeout = ((isMercari?24999:69999) + parseInt(Math.random() * 1000 - 500));
    const cycleTimeout = 13999;
    const div = document.createElement('div');

    var label = document.createElement("label");
    label.classList.add("dToggle");
    label.classList.add("dYellow");
    var checkbox = document.createElement("input");
    checkbox.type = 'checkbox';
    checkbox.style.display = 'none';

    if (isView) {
        checkbox.checked = 'checked';
        document.querySelector('body').classList.add("d");
    }
    checkbox.addEventListener('change', async (event) => {
        if (event.currentTarget.checked) {
            document.querySelector('body').classList.add("d");
            let fromjapan_view = true;
            window.dispatchEvent(new Event('resize'));
            await chrome.storage.local.set({fromjapan_view});
        } else {
            document.querySelector('body').classList.remove("d");
            let fromjapan_view = false;
            window.dispatchEvent(new Event('resize'));
            await chrome.storage.local.set({fromjapan_view}, function () {
            });
        }
    })
    label.appendChild(checkbox);
    var span = document.createElement("span");
    span.appendChild(document.createTextNode("★"));
    label.appendChild(span);
    div.appendChild(label);
    var label2 = document.createElement("label");
    label2.classList.add("dToggle");
    label2.classList.add("dRed");
    var checkbox2 = document.createElement("input");
    checkbox2.type = 'checkbox';
    checkbox2.style.display = 'none';

    if (isRefresh) {
        checkbox2.checked = 'checked';
    }

    var line = document.createElement('div');
    checkbox2.addEventListener('change', async (event) => {
        if (event.currentTarget.checked) {
            let fromjapan_refresh = true;
            await chrome.storage.local.set({fromjapan_refresh});
            refreshItem();
        } else {
            let fromjapan_refresh = false;
            line.style.animation = 'none';
            line.offsetHeight;
            await chrome.storage.local.set({fromjapan_refresh});
        }
    })
    label2.appendChild(checkbox2);
    var span2 = document.createElement("span");
    span2.appendChild(document.createTextNode("↻"));
    label2.appendChild(span2);
    div.appendChild(label2);
    div.classList.add('dControl');
    document.getElementsByTagName('body')[0].appendChild(div);

    /****************/
    /* auto refresh */
    line.classList.add('dLine');

    if (isRefresh) {
        line.style.animation = 'dCountDown ' + initialTimeout + 'ms linear';
    }
    document.getElementsByTagName('body')[0].appendChild(line);

    function reflowLine(ms, isRefresh = true) {
        line.style.animation = 'none';
        line.offsetHeight;
        line.style.animation = 'dCountDown ' + (ms) + 'ms linear';
        if (isRefresh) {
            line.classList.remove('reload-provisioning');
        } else {
            line.classList.add('reload-provisioning');
        }
    }

    function bytesToSize(bytes) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }

    function refreshItem() {
        if (checkbox2.checked) {
            if (timer) clearTimeout(timer);
            const memNow = window.performance.memory.usedJSHeapSize;
            const next = (cycleTimeout + parseInt(Math.random() * 1000 - 500));
            if (!document.hidden) {
                console.log('Memory:', bytesToSize(memNow), '; Reloading page..');
                reflowLine(next, true);
                location.reload();
            } else {
                reflowLine(next, false);
                console.log(document.hidden ? 'Hidden;' : '', 'Memory:' + bytesToSize(memNow) + ';', 'Next refresh', next + 'ms');
                timer = setTimeout(refreshItem, next);
            }
        } else {
            console.log('Auto refresh stopped');
        }
    }

    if (isRefresh) {
        timer = setTimeout(refreshItem, initialTimeout);
    }

    function keyPressListener() {
        document.addEventListener('keydown', function (e) {
            switch (e.keyCode) {
                case 37:
                    document.querySelector(".prev").firstChild.click()
                    break;
                case 39:
                    document.querySelector(".next").firstChild.click()
                    break;
            }
        });
    }
    keyPressListener();

    console.log('┗ End fromjapan script');
}
fromjapan();