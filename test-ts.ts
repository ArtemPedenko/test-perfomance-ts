type Item = {
  id: number | string;
  parent: number | string | null;
  label: string;
};

class TreeStoreOld {
  private store: Item[];

  constructor(items: Item[]) {
    this.store = items;
  }

  getItem(id: number | string): Item | undefined {
    return this.store.find((item) => item.id === id);
  }

  getChildren(id: number | string): Item[] {
    return this.store.filter((item) => item.parent === id);
  }

  getAllChildren(id: number | string): Item[] {
    const result: Item[] = [];
    const stack: (number | string)[] = [id];
    while (stack.length > 0) {
      const currentId = stack.pop()!;
      const children = this.getChildren(currentId);
      result.push(...children);
      stack.push(...children.map((child) => child.id));
    }
    return result;
  }

  getAllParents(id: number | string): Item[] {
    const result: Item[] = [];
    let current = this.getItem(id);
    while (current) {
      result.push(current);
      if (current.parent === null) break;
      current = this.getItem(current.parent);
    }
    return result;
  }
}

class TreeStoreOptimized {
  private store: Item[];
  private indexById: Map<number | string, Item>;
  private childrenByParent: Map<number | string | null, Item[]>;

  constructor(items: Item[]) {
    this.store = items;
    this.indexById = new Map();
    this.childrenByParent = new Map();

    this.buildIndices();
  }

  private buildIndices(): void {
    this.store.forEach((item) => {
      this.indexById.set(item.id, item);
      if (!this.childrenByParent.has(item.parent)) {
        this.childrenByParent.set(item.parent, []);
      }
      this.childrenByParent.get(item.parent)!.push(item);
    });
  }

  getItem(id: number | string): Item | undefined {
    return this.indexById.get(id);
  }

  getChildren(id: number | string): Item[] {
    return this.childrenByParent.get(id) || [];
  }

  getAllChildren(id: number | string): Item[] {
    const result: Item[] = [];
    const stack: (number | string)[] = [id];
    while (stack.length > 0) {
      const currentId = stack.pop()!;
      const children = this.getChildren(currentId);
      result.push(...children);
      stack.push(...children.map((child) => child.id));
    }
    return result;
  }

  getAllParents(id: number | string): Item[] {
    const result: Item[] = [];
    let current = this.getItem(id);
    while (current) {
      result.push(current);
      if (current.parent === null) break;
      current = this.getItem(current.parent);
    }
    return result;
  }
}

// Генерация данных
function generateItems(numItems: number): Item[] {
  return Array.from({ length: numItems }, (_, i) => ({
    id: i,
    parent: i > 0 ? Math.floor(i / 10) : null,
    label: `Item ${i}`,
  }));
}

// Тест производительности
function testPerformance(
  TreeClass: typeof TreeStoreOld | typeof TreeStoreOptimized,
  items: Item[],
  testId: number,
) {
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
const NUM_ITEMS = 1_000_000;
const TEST_ID = Math.floor(Math.random() * NUM_ITEMS);
const items = generateItems(NUM_ITEMS);

generateItems(NUM_ITEMS);

console.log("Testing Old Approach:");
testPerformance(TreeStoreOld, items, TEST_ID);

console.log("Testing Optimized Approach:");
testPerformance(TreeStoreOptimized, items, TEST_ID);
