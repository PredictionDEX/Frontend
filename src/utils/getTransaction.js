export const getTransaction = callTx => new Promise((resolve,reject) => {
    const obs = setInterval(() => {
     // eslint-disable-next-line no-unused-expressions
     typeof window!=='undefined' && window.zilPay.blockchain
        .getTransaction(callTx?.ID)
        .then(tx => {
          if (tx.success) {
            clearInterval(obs)
            resolve(true)
          } else {
            reject(new Error('failed'))
          }
        }).catch(()=>{
          
        })
    }, 2000)
  })

export const Transaction = {
  SENT: 'Sent',
  SUCCESS: 'Success',
  ERROR: 'Error'
}
