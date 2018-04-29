new Progress({
    speedArray      : [1, 5],
    endPositionArray: [75, 95],
    loading         : (index) => {
        document.querySelector('#progress').style.cssText = "width:" + index + "%";
    },
    onLoad          : () => {
        setTimeout(() => {
            document.querySelector('#progress').classList.add("progress-hide");
        }, 500)
    }
});

