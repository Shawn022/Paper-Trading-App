package com.papertrading.backend.utils;

import com.papertrading.backend.dto.stock.SupportedStockResponse;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Component
public class StockRegistry {
    private Map<String, String> stocksMap = Map.ofEntries(

            // ===== NIFTY 50 =====
            Map.entry("RELIANCE.NS", "Reliance Industries"),
            Map.entry("TCS.NS", "Tata Consultancy Services"),
            Map.entry("INFY.NS", "Infosys"),
            Map.entry("HDFCBANK.NS", "HDFC Bank"),
            Map.entry("ICICIBANK.NS", "ICICI Bank"),
            Map.entry("SBIN.NS", "State Bank of India"),
            Map.entry("BHARTIARTL.NS", "Bharti Airtel"),
            Map.entry("ITC.NS", "ITC"),
            Map.entry("LT.NS", "Larsen & Toubro"),
            Map.entry("KOTAKBANK.NS", "Kotak Mahindra Bank"),
            Map.entry("AXISBANK.NS", "Axis Bank"),
            Map.entry("BAJFINANCE.NS", "Bajaj Finance"),
            Map.entry("BAJAJFINSV.NS", "Bajaj Finserv"),
            Map.entry("HCLTECH.NS", "HCL Technologies"),
            Map.entry("SUNPHARMA.NS", "Sun Pharma"),
            Map.entry("TITAN.NS", "Titan Company"),
            Map.entry("ULTRACEMCO.NS", "UltraTech Cement"),
            Map.entry("NESTLEIND.NS", "Nestle India"),
            Map.entry("ASIANPAINT.NS", "Asian Paints"),
            Map.entry("MARUTI.NS", "Maruti Suzuki"),
            Map.entry("WIPRO.NS", "Wipro"),
            Map.entry("TATASTEEL.NS", "Tata Steel"),
            Map.entry("JSWSTEEL.NS", "JSW Steel"),
            Map.entry("POWERGRID.NS", "Power Grid"),
            Map.entry("NTPC.NS", "NTPC"),
            Map.entry("ONGC.NS", "ONGC"),
            Map.entry("COALINDIA.NS", "Coal India"),
            Map.entry("INDUSINDBK.NS", "IndusInd Bank"),
            Map.entry("TECHM.NS", "Tech Mahindra"),
            Map.entry("HINDUNILVR.NS", "HUL"),
            Map.entry("DRREDDY.NS", "Dr Reddy's"),
            Map.entry("CIPLA.NS", "Cipla"),
            Map.entry("BRITANNIA.NS", "Britannia"),
            Map.entry("EICHERMOT.NS", "Eicher Motors"),
            Map.entry("HEROMOTOCO.NS", "Hero MotoCorp"),
            Map.entry("TMCV.NS", "Tata Motors"),
            Map.entry("BAJAJ-AUTO.NS", "Bajaj Auto"),
            Map.entry("GRASIM.NS", "Grasim"),
            Map.entry("HINDALCO.NS", "Hindalco"),
            Map.entry("UPL.NS", "UPL"),
            Map.entry("SBILIFE.NS", "SBI Life"),
            Map.entry("HDFCLIFE.NS", "HDFC Life"),
            Map.entry("DIVISLAB.NS", "Divi's Labs"),
            Map.entry("ADANIENT.NS", "Adani Enterprises"),
            Map.entry("ADANIPORTS.NS", "Adani Ports"),
            Map.entry("APOLLOHOSP.NS", "Apollo Hospitals"),

            // ===== NEXT 50 / LIQUID MIDCAPS =====
            Map.entry("DMART.NS", "Avenue Supermarts"),
            Map.entry("BAJAJHLDNG.NS", "Bajaj Holdings"),
            Map.entry("PIDILITIND.NS", "Pidilite"),
            Map.entry("DABUR.NS", "Dabur"),
            Map.entry("GODREJCP.NS", "Godrej Consumer"),
            Map.entry("MARICO.NS", "Marico"),
            Map.entry("COLPAL.NS", "Colgate Palmolive"),
            Map.entry("BERGEPAINT.NS", "Berger Paints"),
            Map.entry("PAGEIND.NS", "Page Industries"),
            Map.entry("JUBLFOOD.NS", "Jubilant FoodWorks"),
            Map.entry("INDIGO.NS", "IndiGo"),
            Map.entry("IRCTC.NS", "IRCTC"),
            Map.entry("ETERNAL.NS", "Zomato"),
            Map.entry("PAYTM.NS", "Paytm"),
            Map.entry("NYKAA.NS", "Nykaa"),
            Map.entry("TRENT.NS", "Trent"),
            Map.entry("DLF.NS", "DLF"),
            Map.entry("GAIL.NS", "GAIL"),
            Map.entry("IOC.NS", "Indian Oil"),
            Map.entry("BPCL.NS", "BPCL"),
            Map.entry("TVSMOTOR.NS", "TVS Motor"),
            Map.entry("BOSCHLTD.NS", "Bosch"),
            Map.entry("M&M.NS", "Mahindra & Mahindra"),
            Map.entry("ASHOKLEY.NS", "Ashok Leyland"),
            Map.entry("SIEMENS.NS", "Siemens"),
            Map.entry("ABB.NS", "ABB India"),
            Map.entry("BEL.NS", "Bharat Electronics"),
            Map.entry("HAL.NS", "HAL"),
            Map.entry("BHEL.NS", "BHEL"),
            Map.entry("SAIL.NS", "SAIL"),
            Map.entry("NHPC.NS", "NHPC"),
            Map.entry("RVNL.NS", "RVNL"),
            Map.entry("IRFC.NS", "IRFC"),
            Map.entry("IREDA.NS", "IREDA"),
            Map.entry("SUZLON.NS", "Suzlon Energy"),
            Map.entry("JSWENERGY.NS", "JSW Energy"),
            Map.entry("ADANIGREEN.NS", "Adani Green"),
            Map.entry("ADANIPOWER.NS", "Adani Power"),
            Map.entry("LICI.NS", "LIC"),
            Map.entry("MUTHOOTFIN.NS", "Muthoot Finance"),
            Map.entry("MANAPPURAM.NS", "Manappuram Finance"),
            Map.entry("FEDERALBNK.NS", "Federal Bank"),
            Map.entry("IDFCFIRSTB.NS", "IDFC First Bank"),
            Map.entry("AUBANK.NS", "AU Small Finance Bank"),
            Map.entry("BANKBARODA.NS", "Bank of Baroda"),
            Map.entry("PNB.NS", "Punjab National Bank"),
            Map.entry("CANBK.NS", "Canara Bank")
    );

    private List<String> symbols;

    private List<SupportedStockResponse> supportedStocks;

    @PostConstruct
    public void init(){
        this.symbols = stocksMap.keySet().stream().toList();
        this.supportedStocks = new ArrayList<>();

        for(String symbol : stocksMap.keySet()){
            supportedStocks.add(new SupportedStockResponse(symbol , stocksMap.get(symbol)));
        }

    }

    public List<String> getSymbols() {return symbols;}

    public List<SupportedStockResponse> getSupportedStocks() {return supportedStocks;}

    public String getName(String symbol) { return stocksMap.get(symbol); }



}
