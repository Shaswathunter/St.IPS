const SectionHeading = ({badge,title,subtitle})=>{

return(

<div className="text-center mb-20">

<span className="uppercase tracking-[5px] text-secondary font-semibold">

{badge}

</span>

<h2 className="text-5xl lg:text-6xl font-black text-primary mt-4">

{title}

</h2>

<p className="max-w-3xl mx-auto mt-6 text-gray-500 leading-8">

{subtitle}

</p>

</div>

)

}

export default SectionHeading;