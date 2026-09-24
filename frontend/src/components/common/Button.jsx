import { ArrowRight } from "lucide-react";

function Button({
children
}){

return(

<button className="bg-primary hover:bg-blue-900 transition text-white rounded-xl px-8 py-4 font-semibold inline-flex items-center gap-3">

{children}

<ArrowRight size={18}/>

</button>

)

}

 function Container({

children

}){

return(

<div className="max-w-7xl mx-auto px-6">

{children}

</div>

)

}

export {Button,Container};