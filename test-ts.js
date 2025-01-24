"use strict";
class TreeStoreOld {
    constructor(items) {
        this.store = items;
    }
    getItem(id) {
        return this.store.find((item) => item.id === id);
    }
    getChildren(id) {
        return this.store.filter((item) => item.parent === id);
    }
    getAllChildren(id) {
        const result = [];
        const stack = [id];
        while (stack.length > 0) {
            const currentId = stack.pop();
            const children = this.getChildren(currentId);
            result.push(...children);
            stack.push(...children.map((child) => child.id));
        }
        return result;
    }
    getAllParents(id) {
        const result = [];
        let current = this.getItem(id);
        while (current) {
            result.push(current);
            if (current.parent === null)
                break;
            current = this.getItem(current.parent);
        }
        return result;
    }
}
class TreeStoreOptimized {
    constructor(items) {
        this.store = items;
        this.indexById = new Map();
        this.childrenByParent = new Map();
        this.buildIndices();
    }
    buildIndices() {
        this.store.forEach((item) => {
            this.indexById.set(item.id, item);
            if (!this.childrenByParent.has(item.parent)) {
                this.childrenByParent.set(item.parent, []);
            }
            this.childrenByParent.get(item.parent).push(item);
        });
    }
    getItem(id) {
        return this.indexById.get(id);
    }
    getChildren(id) {
        return this.childrenByParent.get(id) || [];
    }
    getAllChildren(id) {
        const result = [];
        const stack = [id];
        while (stack.length > 0) {
            const currentId = stack.pop();
            const children = this.getChildren(currentId);
            result.push(...children);
            stack.push(...children.map((child) => child.id));
        }
        return result;
    }
    getAllParents(id) {
        const result = [];
        let current = this.getItem(id);
        while (current) {
            result.push(current);
            if (current.parent === null)
                break;
            current = this.getItem(current.parent);
        }
        return result;
    }
}
// Генерация данных
function generateItems(numItems) {
    return Array.from({ length: numItems }, (_, i) => ({
        id: i,
        parent: i > 0 ? Math.floor(i / 10) : null,
        label: `Item ${i}`,
    }));
}
// Тест производительности
function testPerformance(TreeClass, items, testId) {
    const tree = new TreeClass(items);
    console.time("start");
    console.time("getItem");
    tree.getItem(testId);
    console.timeEnd("getItem");
    console.time("getChildren");
    tree.getChildren(testId);
    console.timeEnd("getChildren");
    console.time("getAllChildren");
    tree.getAllChildren(testId);
    console.timeEnd("getAllChildren");
    console.time("getAllParents");
    tree.getAllParents(testId);
    console.timeEnd("getAllParents");
    console.timeEnd("start");
}
// Запуск тестов
const NUM_ITEMS = 1000000;
const TEST_ID = Math.floor(Math.random() * NUM_ITEMS);
const items = generateItems(NUM_ITEMS);
generateItems(NUM_ITEMS);
console.log("Testing Old Approach:");
testPerformance(TreeStoreOld, items, TEST_ID);
console.log("Testing Optimized Approach:");
testPerformance(TreeStoreOptimized, items, TEST_ID);
