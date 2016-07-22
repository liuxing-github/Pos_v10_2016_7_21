'use strict';

let tags =
  [

    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000003-2',
    'ITEM000003-2.5',
    'ITEM000005',
    'ITEM000005'

  ];

  function formatTags(tags){
  return tags.map(function(tags){
    let temp = tags.split("-");
    return{
      barcode:temp[0],
      amount:parseFloat(temp[1]) || 1
    }
  });
}
  console.log(formatTags(tags));

  function mergeBarcode(formatted) {
  let mergedBarcode = [];
  for (let i = 0; i < formatted.length; i++) {
    let exist = mergedBarcode.find(function (item) {
      return item.barcode === formatted[i].barcode;
    });
    if (exist) {
      exist.amount += formatted[i].amount;
    } else {
      mergedBarcode.push(Object.assign({}, {barcode: formatted[i].barcode}, {amount: formatted[i].amount}))
    }
  }
  return mergedBarcode;

}
  console.log(mergeBarcode(formatTags(tags)));

  function getAmountItems(mergedBarcode,allItems){

  let amountItems = [];
  for(let i = 0 ; i < allItems.length; i++) {
    let exist = mergedBarcode.find(function (items) {
      return items.barcode === allItems[i].barcode;

    });
    if (exist) {
      amountItems.push(Object.assign({}, allItems[i], {amount: exist.amount}));
    }
  }
  return amountItems;
}
  console.log(getAmountItems(mergeBarcode(formatTags(tags)),loadAllItems()));
let a = getAmountItems(mergeBarcode(formatTags(tags)),loadAllItems());

  function getOriginSubtotal(amountItems) {
    let originSubtotal = [];
    for (let i = 0; i < amountItems.length; i++) {
      let subtotal = amountItems[i].amount * (amountItems[i].price);
      amountItems[i].originSubtotal = subtotal;
      originSubtotal.push(amountItems[i]);
    }
    return originSubtotal;
  }
  console.log(getOriginSubtotal(a));
  let b = getOriginSubtotal(a);

  function getPromotions(originSubtotal,promotions){
    let savedPromotions = [];
    for(let i = 0;i < originSubtotal.length;i++) {

      let exist = (promotions[0].barcodes).find(function (items) {
        return items === originSubtotal[i].barcode;
      });
      let savedAmount = Math.floor(originSubtotal[i].amount / 3);
      let savedMoney = savedAmount * originSubtotal[i].price;
      savedPromotions.push(Object.assign({}, originSubtotal[i], {savedAmount: savedAmount || 0}, {savedMoney: savedMoney || 0}));
    }
    return savedPromotions;
}
console.log(getPromotions(b,loadPromotions()));
let c = getPromotions(b,loadPromotions());

  function getSubtotal(savedPromotions) {
    let detailResult = [];
    for (let i = 0; i < savedPromotions.length; i++) {
      let subtotal = savedPromotions[i].originSubtotal - savedPromotions[i].savedMoney;
      savedPromotions[i].subtotal = subtotal;
    }
    detailResult = savedPromotions;
    return detailResult;
  }
  console.log(getSubtotal(c));
  let d = getSubtotal(c);

  function getTotal(detailResult) {
    let total = 0;
    for(let i = 0;i<detailResult.length;i++){
       total += detailResult[i].subtotal;
    }
     let grandTotal = {total:total};
    return grandTotal;
  }
  console.log(getTotal(d));
  let e = getTotal(d);

  function getTotalSavedMoney(savedPromotions){
    let saved = 0;
    for(let i = 0;i < savedPromotions.length;i++){
      saved += savedPromotions[i].savedMoney;
    }
    let totalSavedMoney = {totalSavedMoney:saved};
    return totalSavedMoney;
  }
  console.log(getTotalSavedMoney(c));
  let f = getTotalSavedMoney(c);

  function printReceipt(detailResult ,totalSavedMoney,grandTotal){
    let receipt = {detailItems:detailResult,totalSavedMoney,grandTotal};
    let printedReceipt = "'***<没钱赚商店>收据***";
    for(let i = 0;i<receipt.detailItems.length;i++){
      printedReceipt+= "\n" + "名称:"+receipt.detailItems[i].name +","+ "数量:" + receipt.detailItems[i].amount
        + "(" + receipt.detailItems[i].unit + ")"+","+"单价:"+receipt.detailItems[i].price.toFixed(2)+ "(元)"
        +","+"小计:"+receipt.detailItems[i].subtotal.toFixed(2)+ "(元)" +"\n";
    }
    printedReceipt += "------------------------" + "\n" + "总计:" +grandTotal.total +"(元)"  + "\n"
      + "节省："+totalSavedMoney.totalSavedMoney +"(元)" +"\n"+"*************************" + "\n";

    return printedReceipt;
  }

console.log(printReceipt(d,f,e));







