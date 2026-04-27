package com.papertrading.backend.customs;

import java.util.*;

public class BestBuySell {
    private List<Double> nums;
    private int k;
    private Double maxProfit;
    private List<int[]> transactions;

    private Double[][][] memo;
    private int[][][] choice; // 0 = skip, 1 = buy, 2 = sell

    public BestBuySell(List<Double> arr, int k) {
        this.nums = arr;
        this.k = k;
        this.transactions = new ArrayList<>();

        int n = arr.size();
        memo = new Double[n][k + 1][2];
        choice = new int[n][k + 1][2];

        this.maxProfit = dp(0, 1, k);

        reconstruct(); // build buy/sell indices
    }

    private Double dp(int idx, int canBuy, int k) {
        if (idx >= nums.size() || k <= 0)
            return 0.0;

        if (memo[idx][k][canBuy] != null)
            return memo[idx][k][canBuy];

        Double ans;

        if (canBuy == 1) {
            Double skip = dp(idx + 1, 1, k);
            Double buy = -nums.get(idx) + dp(idx + 1, 0, k);

            if (buy > skip) {
                choice[idx][k][canBuy] = 1; // buy
                ans = buy;
            } else {
                choice[idx][k][canBuy] = 0; // skip
                ans = skip;
            }

        } else {
            Double skip = dp(idx + 1, 0, k);
            Double sell = nums.get(idx) + dp(idx + 1, 1, k - 1);

            if (sell > skip) {
                choice[idx][k][canBuy] = 2; // sell
                ans = sell;
            } else {
                choice[idx][k][canBuy] = 0; // skip
                ans = skip;
            }
        }

        return memo[idx][k][canBuy] = ans;
    }

    private void reconstruct() {
        int i = 0, canBuy = 1, remainingK = k;
        int buyDay = -1;

        while (i < nums.size() && remainingK > 0) {
            int ch = choice[i][remainingK][canBuy];

            if (canBuy == 1) {
                if (ch == 1) { // buy
                    buyDay = i;
                    canBuy = 0;
                }
            } else {
                if (ch == 2) { // sell
                    transactions.add(new int[]{buyDay, i});
                    remainingK--;
                    canBuy = 1;
                }
            }
            i++;
        }
    }

    public List<Double> getNums(){return nums;}

    public int getK(){ return k; }

    public Double getMaxProfit() {
        return maxProfit;
    }

    public List<int[]> getTransactions() {
        return transactions;
    }
}
