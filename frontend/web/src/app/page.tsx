
export  default async  function Home () {

    const authres = await fetch("http://localhost:4000/v1/auth") ;
    const authData = await authres.json();

    const  paymentres = await fetch("http://localhost:4000/v1/payment") ;
    const  PaymentData = await  paymentres.json();

    const  propertyres = await fetch("http://localhost:4000/v1/property") ;
    const  propertyData = await  propertyres.json();

    const  userres = await fetch("http://localhost:4000/v1/user") ;
    const  userData = await  userres.json();


  return (
   <div>
      <h1>Welcome to Propernu</h1>
      <p>{authData.message}</p>
      <p>{PaymentData.message}</p>
      <p>{propertyData.message}</p>
      <p>{userData.message}</p>
   </div>
  );
}
