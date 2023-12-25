import { useState } from 'react'

export default function Search() {

    const [sidebardata, setSidebardata] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'created_at',
        order: 'desc',
    });

    console.log(sidebardata);
    const handleChange = (e) => {
        //1st condition
        if (
            e.target.id === 'all' || 
            e.target.id === 'rent' || 
            e.target.id === 'sale') {
            setSidebardata({
                ...sidebardata,
                 type: e.target.id
            })
        }

        //search term
        if (e.target.id === 'searchTerm') {
            setSidebardata({
                ...sidebardata, 
                searchTerm: e.target.value
            });
        }

        //true of false
        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setSidebardata({
                ...sidebardata, 
                [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false,
            });
        }

        if (e.target.id === 'sort_order') {
            //need to split
            const sort = e.target.value.split('_')[0] || 'created_at';

            const order = e.target.value.split('_')[1] || 'desc';

            setSidebardata({
                ...sidebardata,
                sort,
                order
            });
        }
    };

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
                    value={sidebardata.searchTerm}
                    onChange={handleChange}
                    />
                </div>
                <div className='flex gap-2 flex-wrap items-center'>
                    <label className='font-semibold'>Type:</label>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="all" className='w-5' 
                        onChange={handleChange}
                        checked={sidebardata.type === 'all'}
                        />
                        <span>Rent & Sale</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="rent" className='w-5' 
                        onChange={handleChange} 
                        checked={sidebardata.type === 'rent'} 
                        />
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="sale" className='w-5' 
                        onChange={handleChange}
                        checked={sidebardata.type === 'sale'}
                        />
                        <span>Sale</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="offer" className='w-5' 
                        onChange={handleChange}
                        checked={sidebardata.offer}
                        />
                        <span>Offer</span>
                    </div>
                </div>
                <div className='flex gap-2 flex-wrap items-center'>
                    <label className='font-semibold'>Amanities:</label>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="parking" className='w-5' 
                        onChange={handleChange}
                        checked={sidebardata.parking}
                        />
                        <span>Parking</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="furnished" className='w-5' 
                        onChange={handleChange}
                        checked={sidebardata.furnished}
                        />
                        <span>Furnished</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="sale" className='w-5' 
                        onChange={handleChange}
                        checked={sidebardata.type === 'sale'}
                        />
                        <span>Sale</span>
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <label className='font-semibold'>Sort:</label>
                    <select name="" 
                    id="sort_order"
                    className='border rounded-lg p-3'
                    onChange={handleChange}
                    defaultValue={'created_at_desc'}
                    >
                        <option value="regularPrice_desc">Price high to low</option>
                        <option value="regularPrice_asc">Price low to high</option>
                        <option value="createdAt_desc">Latest</option>
                        <option value="createdAt_asc">Oldest</option>
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