(() => {
    console.log("drag.js");
    const drag_items = document.querySelectorAll('.drag-item'); //class item
    const drag_containers = document.querySelectorAll('.drag-container'); //class container item
    let draggedItem = null;
    let append_in_item_container = false;

    drag_containers.forEach(item_container => {
        item_container.addEventListener('drop', function () {
            if(item_container.children.length == 0){
                item_container.appendChild(draggedItem);
                append_in_item_container = true;
            }
        });
    });
    
    drag_items.forEach(item => {
        //console.log(item, item.getBoundingClientRect());
        //--------------------------------------------
        
        item.addEventListener('dragstart', function () {
            draggedItem = item;
            setTimeout(() => item.style.backgroundColor = 'grey', 0);
        });

        item.addEventListener('dragend', function (e) {
            setTimeout(() => {
                draggedItem.style.backgroundColor = '';
                draggedItem = null;
            }, 0);
        });

        //--------------------------------------------

        document.addEventListener('dragover', function (e) {
            e.preventDefault();
            const x = e.clientX; //jarak mouse
            const y = e.clientY;

            let closestEl = null;
            let minDist = Infinity;

            drag_items.forEach(item => {
                if (item !== draggedItem) {
                    const rect = item.getBoundingClientRect(); //info posisi item
                    const dx = x - (rect.left + rect.width / 2);
                    const dy = y - (rect.top + rect.height / 2);
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < minDist) {
                        minDist = dist;
                        closestEl = item;
                        //console.log(item, item.getBoundingClientRect());
                    }
                }
                item.classList.remove('closest');
            });

            if (closestEl) {
                if (!append_in_item_container){
                    closestEl.classList.add('closest');
                    const rect = item.getBoundingClientRect();
                    const item_center = (rect.top + rect.height/2);
                    if (y > item_center){
                        closestEl.parentElement.insertBefore(draggedItem, closestEl.nextSibling);
                    }else{
                        closestEl.parentElement.insertBefore(draggedItem, closestEl);
                    }
                }else{
                    append_in_item_container = false;
                }
            }
        });

        item.addEventListener('dragenter', function (e) {
            e.preventDefault();
            if (item !== draggedItem) item.classList.add('drag-over');
        });

        item.addEventListener('dragleave', function () {
            item.classList.remove('drag-over');
        });

        //--------------------------------------------

        item.addEventListener('drop', function () {
            //console.log("drop");
            if (item !== draggedItem) {
                item.classList.remove('drag-over');
            }
        });
    });
})();