package com.papertrading.backend.DAA;

import java.util.ArrayList;
import java.util.List;


public class MaxHeap {
    private List<StockScore> heap;

    public MaxHeap(){
        heap = new ArrayList<>();
    }

    private void heapifyUp(int index){
         while (index > 0) {
             int parent = (index - 1) / 2;

             if (heap.get(parent).weightedScore >= heap.get(index).weightedScore) {
                 break;
             }

             swap(parent, index);
             index = parent;
         }
    }
    private void heapifyDown(int index) {
        int size = heap.size();

        while (index < size) {
            int left = 2 * index + 1;
            int right = 2 * index + 2;
            int largest = index;

            if (left < size && heap.get(left).weightedScore > heap.get(largest).weightedScore) {
                largest = left;
            }

            if (right < size && heap.get(right).weightedScore > heap.get(largest).weightedScore) {
                largest = right;
            }

            if (largest == index) break;

            swap(index, largest);
            index = largest;
        }
    }
    public StockScore pop() {
        if (heap.isEmpty()) return null;

        StockScore root = heap.get(0);
        StockScore last = heap.remove(heap.size() - 1);

        if (!heap.isEmpty()) {
            heap.set(0, last);
            heapifyDown(0);
        }

        return root;
    }
    private void swap(int i, int j) {
        StockScore temp = heap.get(i);
        heap.set(i, heap.get(j));
        heap.set(j, temp);
    }
    public int size() {
        return heap.size();
    }

    public StockScore top() {
        if (heap.isEmpty()) return null;
        return heap.get(0);
    }
}
