import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { getTransaction } from 'src/utils/getTransaction'
import Toast from '../toast/Toast'

export const successNotification = message => {
  toast.success(message, {
    position: 'bottom-right',
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: false
  })
  setTimeout(() => {
    toast.dismiss()
  }, 3000)
}
export const errorNotification = message => {
  toast.error(message, {
    position: 'bottom-right',
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: false
  })
  setTimeout(() => {
    toast.dismiss()
  }, 3000)
}
export const progressNotification = (
  callTx,
  txName,
  gameTitle,
  callback,
  close
) => {
  ;(async () => {
    await toast.promise(
      getTransaction(callTx),
      {
        pending: {
          render() {
            return (
              <Toast txName={txName} txHash={callTx.ID} gameTitle={gameTitle} />
            )
          }
        },
        success: {
          render() {
            if (callback) {
              callback()
            }
            return (
              <Toast
                txName="Transaction Successful"
                txHash={callTx.ID}
                gameTitle={gameTitle}
                autoClose={100}
              />
            )
          }
        },
        error: {
          render() {
            setTimeout(() => {
              toast.dismiss(callTx.ID)
            }, 3000)
            return (
              <Toast
                txName="Transaction Failed"
                txHash={callTx.ID}
                gameTitle={gameTitle}
                autoClose={100}
              />
            )
          }
        }
      },
      {
        toastId: callTx.ID,
        position: 'bottom-right',
        hideProgressBar: false,
        closeOnClick: false,
        closeButton: false,
        pauseOnHover: false,
        draggable: false,
        progress: false
      }
    )
    if (close) {
      setTimeout(() => {
        toast.dismiss(callTx.ID)
      }, 3000)
    }
  })()
}
export const destroyNotification = id => toast.dismiss(id)
