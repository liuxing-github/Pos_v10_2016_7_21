'use strict';

describe('pos', () => {

  it('should print text', () => {

    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2.5',
      'ITEM000005',
      'ITEM000005-2',
    ];

    spyOn(console, 'log');

    printReceipt(tags);

    const expectText = `***<没钱赚商店>收据***
名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)
名称：荔枝，数量：2.5斤，单价：15.00(元)，小计：37.50(元)
名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)
----------------------
总计：58.50(元)
节省：7.50(元)
**********************`;

    expect(console.log).toHaveBeenCalledWith(expectText);
  });
});

describe("formattedTags",function() {
  it("should return formatted of tags ",function (){
    let tags =
      [
        "Item00001",
        "Item00002-2.5"
      ];
    let result = formatTags(tags);
    expect(result).toEqual(
      [
        {
          barcode:"Item00001",
          amount:1
        },
        {
          barcode:"Item00002",
          amount:2.5
        }
      ]
    );


  })

});

describe("mergedBarcode",function(){
  it("should return mergedBarcode of formattedTags",function () {
    let formatted =
    [
      {
        amount:1,
        barcode:"ITEMS000001"
      },
      {
        amount:1,
        barcode:"ITEMS000001"
      }
    ];

    let result = mergeBarcode(formatted);
    expect(result).toEqual(
      [
        {
          amount:2,
          barcode:"ITEMS000001"
        }
      ]
    );
  })
});

describe("amountItems",function () {
  it("should return amountItems of mergedBarcode",function() {
    let mergedBarcode =
      [
        {
          amount: 5,
          barcode: "ITEMS000001"
        }
      ];

     let  allItems =
      [
        {
          barcode: 'ITEM000001',
          name: '雪碧',
          unit: '瓶',
          price: 3.00
        }
      ];

    let result = getAmountItems(mergeBarcode(formatTags(tags)),allItems);
    expect(result).toEqual(
      [
        {
          barcode: 'ITEM000001',
          name: '雪碧',
          unit: '瓶',
          price: 3.00,
          amount:5
        }
      ]
    );
  })
  });
let  allItems =
  [
    {
      barcode: 'ITEM000001',
      name: '雪碧',
      unit: '瓶',
      price: 3.00
    }
  ];
describe("originSubtotal",function () {
  it("should return originSubtotal of amountItems ",function(){
    let amountBarcode =
      [
        {
          barcode: 'ITEM000001',
          name: '雪碧',
          unit: '瓶',
          price: 3.00,
          amount:5
        }
      ];
    let originSubtotal =
    [
    {
      barcode: 'ITEM000001',
      name: '雪碧',
      unit: '瓶',
      price: 3.00,
      amount:5,
      originSubtotal:15
    }
    ];
    let result = getOriginSubtotal(getAmountItems(mergeBarcode(formatTags(tags)),allItems));
    expect(result).toEqual(
      [
        {
          barcode: 'ITEM000001',
          name: '雪碧',
          unit: '瓶',
          price: 3.00,
          amount:5,
          originSubtotal:15
        }
      ]
    );
  })

});
describe("savedPromotions",function(){
  it("should return savedPromotions of originSubtotal",function(){
    let originSubtotal =
      [
        {
          barcode: 'ITEM000001',
          name: '雪碧',
          unit: '瓶',
          price: 3.00,
          amount:5,
          originSubtotal:15
        }
        ]
    let promotions = [{barcodes:["ITEM000001"]}];
    let result = getPromotions(getOriginSubtotal(getAmountItems(mergeBarcode(formatTags(tags)),allItems)),promotions);
    expect(result).toEqual(
      [
        {
          barcode: 'ITEM000001',
          name: '雪碧',
          unit: '瓶',
          price: 3.00,
          amount:5,
          originSubtotal:15,
          savedAmount:1,
          savedMoney:3
        }
      ]
    );
  })
});


let promotions = [{barcodes:["ITEM000001"]}];
describe("detailResult",function () {
  it("should return detailResult of savedPromotion and originSubtotal",function () {
    let savedPromotions =
      [
        {
          barcode: 'ITEM000001',
          name: '雪碧',
          unit: '瓶',
          price: 3.00,
          amount:5,
          originSubtotal:15,
          savedAmount:1,
          savedMoney:3
        }
      ];

    let originSubtotal =
      [
        {
          barcode: 'ITEM000001',
          name: '雪碧',
          unit: '瓶',
          price: 3.00,
          amount:5,
          originSubtotal:15
        }
      ];
      let result = getSubtotal(getPromotions(getOriginSubtotal(getAmountItems(mergeBarcode(formatTags(tags)),allItems)),promotions));
    expect(result).toEqual(
      [
        {
          barcode: 'ITEM000001',
          name: '雪碧',
          unit: '瓶',
          price: 3.00,
          amount:5,
          originSubtotal:15,
          savedAmount:1,
          savedMoney:3,
          subtotal:12
        }
      ]


    );

  })

});

describe("GrandPromotions",function () {
  it("should return grandPromotions of savedPromotons",function () {
    let savedPromotions =
      [
        {
          barcode: 'ITEM000001',
          name: '雪碧',
          unit: '瓶',
          price: 3.00,
          amount:5,
          originSubtotal:15,
          savedAmount:1,
          savedMoney:3
        }
      ];
      let result = {totalSavedMoney:3};
    expect(result).toEqual(
    {totalSavedMoney:3}
      );

  })
});
describe("Total",function(){
  it("should return total of detailResult and totalSavedMoney",function () {
    let detailResult =
      [
        {
          barcode: 'ITEM000001',
          name: '雪碧',
          unit: '瓶',
          price: 3.00,
          amount:5,
          originSubtotal:15
        }
      ];
    let totalSaved = {totalSavedMoney:3};
    let result = {total:12} ;
    expect(result).toEqual(
      {total:12}
    );
  })


});
