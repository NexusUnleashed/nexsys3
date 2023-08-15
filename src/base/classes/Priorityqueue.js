class Node {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
}

class Heap {
    constructor(opt_heap) {
        this.nodes = [];
        if (opt_heap) {
            this.insertAll(opt_heap);
        }
    }

    insert(key, value) {
        const node = new Node(key, value);
        const nodes = this.nodes;
        nodes.push(node);
        this.moveUp(nodes.length - 1);
    }

    insertAll(heap) {
        let keys;
        let values;
        if (heap instanceof Heap) {
            keys = Object.keys(heap);
            values = Object.values(heap);

            if (this.nodes.length <= 0) {
                const nodes = this.nodes;
                for (let i = 0; i < keys.length; i++) {
                    nodes.push(new Node(keys[i], values[i]));
                }
                return;
            }
        } else {
            keys = Object.keys(heap);
            values = Object.values(heap);
        }

        for (let i = 0; i < keys.length; i++) {
            this.insert(keys[i], values[i]);
        }
    }

    remove() {
        const nodes = this.nodes;
        const count = nodes.length;
        const rootNode = nodes[0];
        if (count <= 0) {
            return undefined;
        } else if (count === 1) {
            this.nodes = [];
        } else {
            nodes[0] = nodes.pop();
            this.moveDown(0);
        }
        return rootNode.value;
    }

    peek() {
        const nodes = this.nodes;
        if (nodes.length === 0) {
            return undefined;
        }
        return nodes[0].value;
    }

    peekKey() {
        return this.nodes[0] && this.nodes[0].key;
    }

    moveDown(index) {
        const nodes = this.nodes;
        const count = nodes.length;

        // Save the node being moved down.
        const node = nodes[index];
        // While the current node has a child.
        while (index < count >> 1) {
            const leftChildIndex = this.getLeftChildIndex(index);
            const rightChildIndex = this.getRightChildIndex(index);

            // Determine the index of the smaller child.
            const smallerChildIndex =
                rightChildIndex < count &&
                    nodes[rightChildIndex].key < nodes[leftChildIndex].key
                    ? rightChildIndex
                    : leftChildIndex;

            // If the node being moved down is smaller than its children, the node
            // has found the correct index it should be at.
            if (nodes[smallerChildIndex].key > node.key) {
                break;
            }

            // If not, then take the smaller child as the current node.
            nodes[index] = nodes[smallerChildIndex];
            index = smallerChildIndex;
        }
        nodes[index] = node;
    }

    moveUp(index) {
        const nodes = this.nodes;
        const node = nodes[index];

        // While the node being moved up is not at the root.
        while (index > 0) {
            // If the parent is less than the node being moved up, move the parent down.
            const parentIndex = this.getParentIndex(index);
            if (nodes[parentIndex].key > node.key) {
                nodes[index] = nodes[parentIndex];
                index = parentIndex;
            } else {
                break;
            }
        }
        nodes[index] = node;
    }

    getLeftChildIndex(index) {
        return index * 2 + 1;
    }

    getRightChildIndex(index) {
        return index * 2 + 2;
    }

    getParentIndex(index) {
        return (index - 1) >> 1;
    }
}

export default class PriorityQueue extends Heap {
    push(priority, value) {
        this.insert(priority, value);
    }

    pop() {
        return this.remove();
    }
}
