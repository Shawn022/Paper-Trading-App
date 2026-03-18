package com.papertrading.backend.DAA;

public class CustomHashMap <K,V >{
    private static class Node<K,V> {
        K key;
        V value;
        Node<K, V> next;

        Node(K key, V value) {
            this.key = key;
            this.value = value;
        }
    }

    private Node<K, V>[] buckets;
    private int capacity = 16;

    public CustomHashMap() {
        buckets = new Node[capacity];
    }

    public int hashFunction(K key){
        return Math.abs(key.hashCode()) % capacity;
    }

    public void put(K key, V value) {

        int index = hashFunction(key);

        Node<K, V> head = buckets[index];

        while (head != null) {

            if (head.key.equals(key)) {
                head.value = value;
                return;
            }

            head = head.next;
        }

        Node<K, V> newNode = new Node<>(key, value);

        newNode.next = buckets[index];

        buckets[index] = newNode;
    }

    public V get(K key) {

        int index = hashFunction(key);

        Node<K, V> head = buckets[index];

        while (head != null) {

            if (head.key.equals(key)) {
                return head.value;
            }

            head = head.next;
        }

        return null;
    }
}
