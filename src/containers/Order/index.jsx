import React, { useEffect, useState } from "react";
import SelectOrder from "../../components/SelectOrder/SelectOrder"
import { Button, Input, Typography } from 'antd';
import db from "../../firebaseConfig";
import { Alert } from 'antd';
import { useTranslation } from 'react-i18next';

const {Title} = Typography;

const Order = () => {

  const [t,i18n] = useTranslation();

  const [orders, setOrders] = useState([])
  const [orderMultiplier, setOrderMultiplier] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState("")
  const [insufficientIngredients, setInsufficientIngredients]= useState([])
  const fetchOrders = async () => {
    const res = await db.collection("recipe").get()
    const data = res.docs.map(doc => doc.data());
    const data2 = data.map(obj => {
      return {label: obj.recipeName, value:obj.recipeCode};
    })
    // console.log("data",data.find((order) => order.orderCode === "OSAL").ingredients);
    setOrders(data)

  }

  const onClose = (e) => {
    console.log(e, 'I was closed.');
  };

  const addOrder = async() => {
    if (orders.length > 0){
      let isSufficient = true
      
      const ingredientsArr = orders
      .find((order) => order.recipeCode === selectedOrder)
      .ingredients;
      console.log("ingArr", ingredientsArr)
      ingredientsArr.forEach(async(orderItem) => {
      const res = await orderItem.itemDocRef.get()
      console.log(res)
    const data = res.data()
     console.log(data);
    if(data.stock - orderItem.requiredAmount * orderMultiplier < 0) {
      isSufficient = false
      console.log(isSufficient);
      //if the ingredient is insufficient, add it into insufficient ingredients state array
      setInsufficientIngredients(prevState=>[...prevState, orderItem])
    }
    })
    setTimeout(()=> {

      if (isSufficient) {
        console.log("i'm sufficient");
        ingredientsArr.forEach(async(orderItem) => {
          const res = await orderItem.itemDocRef.get()
          const data = res.data()
          console.log(data.stock);
          orderItem.itemDocRef.update({
            stock: data.stock - orderItem.requiredAmount * orderMultiplier
          })
        });
        
      } else {
        return <Alert
        message={t('order.errorText')}
        description={`${t('order.insufText')} ${insufficientIngredients.join(", ")}`}
        type="error"
        closable
        onClose={onClose}
      />
        // alert("insufficient ingredients")
      }

    },1000)
    


      
      
    } else {
      console.log("empty");
    }
  }

  function onChange(value) {
      setSelectedOrder(value);
    }
    
  
    useEffect(() => {
      fetchOrders();
      
    },[]);
  return(
      <div >
      <Title level={3}>{t('order.orders')}</Title>
      <div style={{display:"flex", justifyContent: "center"}}>
      <SelectOrder 
      onChange={onChange} 
      orders={orders}/>
      <Input style={{width: "200px"}} type="number" onChange={(e) => setOrderMultiplier(e.target.value)} value={orderMultiplier} placeholder="number of orders" min={1}/>
      <Button disabled={selectedOrder? false : true} onClick={addOrder} type="primary">{t('order.addOrder')}</Button>
      </div>
      </div>
  )
}

export default Order;







