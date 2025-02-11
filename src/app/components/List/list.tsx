'use client'
import React, {ReactElement, useState, useRef, useEffect} from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { getProducts } from '@/app/services/products';
import Button from '@mui/material/Button';
import { HTML5Backend } from "react-dnd-html5-backend";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Badge from "@mui/material/Badge";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import LinearProgress from '@mui/material/LinearProgress';

const ItemType = {
    ITEM: "item",
};

export default function List () {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [keyboard, setKeyboard] = useState('');
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [cartItems, setCartItems] = useState([]);

    const validateInput = () => {
        if(keyboard !== '') {
            setProducts([]);
            setPage(1);
            getData();
        } else {
            setProducts([]);
        }
    }

    const resetData = () => {
        setProducts([]);
        setPage(1);
        setKeyboard('');
        setLoading(false);
        setCartItems([]);
        
    }

    const getData = async () => {
        if(keyboard !== '') {
            setLoading(true);
            const list: never[] = await getProducts(keyboard, page);
        
            if (list?.length === 0) {
                setHasMore(false);
                return;
            }

            setProducts((prevItems: never[]) => [
                ...prevItems,
                ...list,
            ]);
            setPage(page + 1);
            setLoading(false);
        }
    }

    const addToCart = (item: never) => {
        console.log('item', item);
        setCartItems((prevCartItems: never[]) => [...prevCartItems, item]);
        removeElement(item);
    };

    const removeElement = (item: string) => {
        setProducts((prevItems) => {
            const newList = prevItems.filter((product: { id: string }) => product?.id !== item);
            return [
            ...newList
        ]});
    }

    return (
        <Card sx={{ minWidth: 275, minHeight: 500 }}>
        <CardContent>
            <h1 style={{color: 'GrayText', marginBottom: '10px'}}>e-Commerce Gapsi</h1>
            <Box
                component="form"
                sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
                noValidate
                autoComplete="off"
            >
            <TextField id="standard-basic" label="Buscar producto" variant="standard" value={keyboard} 
                onChange={(e) => setKeyboard(e.target.value)}
            />
            <Button variant="contained" onClick={() => validateInput()}>Buscar</Button>
            <Button variant="outlined" onClick={() => resetData()}>Limpiar</Button>
            </Box>      

            <DndProvider backend={HTML5Backend}>
                <div >
                <Cart cartItems={cartItems} addToCart={addToCart} />

                <InfiniteScroll
                    dataLength={products.length}
                    next={getData}
                    hasMore={hasMore}
                    loader={loading ?? <h4>Consultando la información...</h4>}
                    endMessage={
                        <p style={{ textAlign: "center", margin: 200}}></p>
                    }
                >
                    <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>

                    
                    {products?.map((product: { id: string, __typename: string, name:string, price: string, description: string, image: string }, index) => {
                        if (product?.__typename === "Product") {
                            return (
                                <DraggableItem key={product?.id + '-' + index} id={product?.id} item={
                                    <div style= {{borderWidth: 1, borderColor: 'grey', width: 300}}>
                                        <img src={product.image} width={200} height={'auto'}/>
                                        <div style={{backgroundColor: 'darkgray', opacity: '0.6', height: 1}}></div>
                                        <div style={{width: '100%'}}>
                                            <div style={{width: '80%'}}>
                                                <b style={{color: 'gray', fontSize: 20}}>{product?.name}</b>
                                            </div>   
                                            <div style={{width: '10%'}}>
                                                <b style={{color: 'blue', fontSize: 18}}>${product?.price}</b>
                                            </div>   
                                        </div> 
                                        <div dangerouslySetInnerHTML={{ __html: product?.description }} />
                                    </div>
                                }/>
                            );
                        }
                        
                    })}
                    </div>
                    
                </InfiniteScroll>
            </div>
            </DndProvider>

            {loading && (
                <div style={{height: 20, marginTop: 20, marginBottom: 20, marginLeft: 20, width: '90%'}}>
                    <h4>Cargando ... </h4>
                    <LinearProgress color="inherit" />
                </div>
            )}

        </CardContent>
        </Card>        
    );
}

const DraggableItem = (props: {item: ReactElement, id: string}) => {
    const ref = useRef(null);
    const [, drag] = useDrag(() => ({
        type: ItemType.ITEM,
        item: { id: props.id },
    }));

    useEffect(() => {
        if(ref.current) {
            drag(ref.current);
        }
    }, [ref, drag]);

    return (
        <div ref={ref} style={{ padding: 20, border: "1px solid #ccc", margin: 10 }}>
            {props.item}
        </div>
        );
};
    
const Cart = (props:  { cartItems: never[], addToCart: (item: never) => void }) => {
    const ref = useRef(null);
    const [, drop] = useDrop(() => ({
        accept: ItemType.ITEM,
        drop: (item: {id: never}) => props.addToCart(item.id),
    }));

    useEffect(() => {
        if(ref.current) {
            drop(ref.current);
        }
    }, [ref, drop]);

    return (
        <div ref={ref} style={{ position: "relative", display: "inline-block", width: '-webkit-fill-available', textAlign: 'center'}}>
            <Badge badgeContent={props.cartItems.length} color="secondary">
                <ShoppingCartIcon style={{ fontSize: 150 }} />
            </Badge>
        </div>
    );
};
