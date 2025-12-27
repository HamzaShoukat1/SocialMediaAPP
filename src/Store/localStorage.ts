export const loadState = ()=>{
  try {
    const serializedState = localStorage.getItem('auth')
    if(!serializedState)
    {
      return undefined

    }
  return JSON.parse(serializedState)
    
  } catch (err) {
    console.log('failer', err);
    return undefined
    
  }
};


export const saveState = (state:any)=>{
  try {


    localStorage.setItem('auth', JSON.stringify(state)) //Browsers only store strings in localStorage.
    
  } catch (err) {
    console.warn('failed', err)
    return undefined
    
  }

};