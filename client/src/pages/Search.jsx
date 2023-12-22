import React from 'react'

export default function Search() {
  return (
    <div className='flex flex-col md:flex-row'>
        {/* left side */}
        <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
            <form action="" className='flex flex-col gap-8'>
                <div className='flex items-center gap-2'>
                    <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                    <input type="text" 
                    id='searchTerm'
                    placeholder='Search...'
                    className='border rounded-lg p-3 w-full'
                    />
                </div>
                <div className='flex gap-2 flex-wrap items-center'>
                    <label className='font-semibold'>Type:</label>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="all" className='w-5' />
                        <span>Rent & Sale</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="rent" className='w-5' />
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="sale" className='w-5' />
                        <span>Sale</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="offer" className='w-5' />
                        <span>Offer</span>
                    </div>
                </div>
                <div className='flex gap-2 flex-wrap items-center'>
                    <label className='font-semibold'>Amanities:</label>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="parking" className='w-5' />
                        <span>Parking</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="furnised" className='w-5' />
                        <span>Furnished</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="sale" className='w-5' />
                        <span>Sale</span>
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <label className='font-semibold'>Sort:</label>
                    <select name="" id="sort_order"
                    className='border rounded-lg p-3'
                    >
                        <option value="">Price high to low</option>
                        <option value="">Price low to high</option>
                        <option value="">Latest</option>
                        <option value="">Oldest</option>
                    </select>
                </div>
                <button className='border rounded-lg p-3 bg-slate-700 text-white hover:opacity-95 uppercase'>Search</button>
            </form>
        </div>
        {/* right side */}
        <div className=''>
            <h1 className='text-3xl font-semibold border-b p-3 mt-5 text-slate-700'>
                Listing results:
            </h1>
        </div>
    </div>
  )
}
