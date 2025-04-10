import { useEffect, useState } from 'react';
import swalAlert from "../components/common/alert";
import { useRouter } from "next/router";
import { hideLoader, showLoader } from "../components/common/preloader";
import axios from "axios";

export const useFetch = (func, query = {}, load = true) => {
    const router = useRouter()
    const [data, setData] = useState();
    const [loading, setLoading] = useState(load)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [params, setParams] = useState({
        ...query,
        page: query?.page || 1,
        size: query?.size || 10,
    })

    useEffect(() => {
        if (load) {
            getData(params)
        }
    }, []);


    const getData = (query) => {
        setLoading(true)
        setError(false)
        setParams({ ...params, ...query })
        try{

            func({ ...params, ...query }).then(({ error, data, msg, meta, ...rest }) => {
                setLoading(false)
                if (error === false) {
                    setData(data)
                } else {
                    setError(true)
                    setErrorMessage(msg)
                    setData(undefined)
                }
                if (rest) {
                    if ((Object.values(rest) + "").replaceAll(',', '') === 'Unauthorized.') {
                        router.push('/login')
                    }
                }

            }).catch(e => {
                console.log(e)
            })
        }catch (e) {
            console.log(e)
           


        }
    }
    const clear = () => setData(undefined)
    return [data, getData, { query: params, loading, error, errorMessage, clear }];
}

export const userAction = async (func, data, reload, alert= true, t) => {
    showLoader()
    const { error, msg, data: d } = await func({ ...data })
    hideLoader()
    if (error === false) {
        if (reload) {
            reload(d)
        }
        if (!!alert) {
            await swalAlert.success(!!t ? t(msg) : msg, t)
        }
    } else {
        await swalAlert.error(!!t ? t(msg) : msg, t)
    }
}

export const userActionConfirm = async (func, data, reload, message, confirmText, t, alert = true) => {
    const { isConfirmed } = await swalAlert.confirm(t ? t(message) : message, t ? t(confirmText) : confirmText, t)
    if (isConfirmed) {
        await userAction(func, data, reload, alert, t)
    }
}


export const useLocations = () => {
    const [date, setData] = useState({})
    useEffect(() => {
        (async () => {
            const { data } = await axios.get('/locations.json')
            setData(data)
        })()
    }, [])
    return date
}