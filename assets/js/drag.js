const drag = (() => {
    function init(editorElement){
        const dragItems = document.querySelectorAll('.drag-item'); //class item
        const dragContainers = document.querySelectorAll('.drag-container'); //class container item
        let draggedItem = null;
        let lastX = null;
        let lastY = null;
        let draggedItemContainer = null;
        let appendInItemContainer = false;

        dragContainers.forEach(itemContainer => {
            itemContainer.addEventListener('dragover', function () {
                if(itemContainer.children.length == 0){
                    itemContainer.appendChild(draggedItem);
                    appendInItemContainer = true;
                    draggedItemContainer = itemContainer;
                    editorElement(draggedItem.id, null, itemContainer.id);
                }else{
                    if (draggedItemContainer != itemContainer){
                        appendInItemContainer = false;
                    }
                }
            });
        });
        
        dragItems.forEach(item => {
            item.addEventListener('dragstart', function (e) {
                draggedItem = item;
                const img = new Image();
                img.src = '';
                e.dataTransfer.setDragImage(img, 0, 0);
                setTimeout(() => item.classList.add('dragging-item'), 0);
            });

            item.addEventListener('dragend', function (e) {
                item.classList.remove('dragging-item');
                draggedItem = null;
                appendInItemContainer = false;
            });

            //--------------------------------------------

            document.addEventListener('dragover', function (e) {
                e.preventDefault();
                
                if (draggedItem){
                    const x = e.clientX; //jarak mouse
                    const y = e.clientY;

                    const rectDragged = draggedItem.getBoundingClientRect();
                    const isOutside =
                        x < rectDragged.left ||
                        x > rectDragged.right ||
                        y < rectDragged.top ||
                        y > rectDragged.bottom;
                    
                    if(isOutside){
                        lastX = x;
                        lastY = y;
                        let closestEl = null;
                        let minDist = Infinity;

                        dragItems.forEach(item => {
                            if (item !== draggedItem) {
                                const rectItems = item.getBoundingClientRect(); //info posisi item
                                const dx = x - (rectItems.left + rectItems.width / 2);
                                const dy = y - (rectItems.top + rectItems.height / 2);
                                const dist = Math.sqrt(dx * dx + dy * dy);

                                if (dist < minDist) {
                                    minDist = dist;
                                    closestEl = item;
                                }
                            }
                        });

                        if (closestEl) {
                            if (!appendInItemContainer){
                                const rectClosest = closestEl.getBoundingClientRect();
                                const itemCenter = (rectClosest.top + rectClosest.height/2);
                                let nextEl = null;
                                let targetId = null;
                                if (y > itemCenter){
                                    nextEl = closestEl.nextSibling;
                                    targetId = (nextEl && nextEl.nodeType === 1) ? nextEl.id || null : null;
                                }else{
                                    nextEl = closestEl;
                                    targetId = closestEl.id;
                                }
                                closestEl.parentElement.insertBefore(draggedItem, nextEl);
                                editorElement(draggedItem.id, targetId, draggedItem.parentElement.id);
                            }
                        }
                    }
                }
            });
        });
    }
    return init;
})();

function callDrag(editorElement) {
    drag(editorElement);
}