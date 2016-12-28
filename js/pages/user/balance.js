var vmBalance = avalon.define({
  $id: 'balance',
  amount: 0,
  money: '',
  isDisabled: true,
  //提现按钮变化
  rechargeBtnChange: function() {
      if (vmBalance.money.length > 0) {
          vmBalance.isDisabled = false;
      } else {
          vmBalance.isDisabled = true;
      }
  },
  recharge: function() {

  }
});