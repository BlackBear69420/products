"use client";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Doc } from "../../convex/_generated/dataModel";

const formSchema = z.object({
  title: z.string().min(1).max(200),
  file: z
    .custom<FileList>((val) => val instanceof FileList, "Required")
    .refine((files) => files.length > 0, "Required"),
    description:z.string().min(1).max(200),
    price:z.string().min(1),
    url:z.string().min(1),
});


interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string; 
  link: string;
}

export default function Home() {

  const createFile = useMutation(api.tasks.createFile)
  const Files = useQuery(api.tasks.getFiles);

  useEffect(() => {
    console.log("Files data:", Files);
  }, [Files]);
  
  const [products, setProducts] = useState<Product[]>([]);
  const generateUploadUrl = useMutation(api.tasks.generateUploadUrl)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      file:undefined,
      description:"",
      price:"",
      url:"",
    },
  })
const fileRef=form.register("file");
 async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
    console.log(values.file)
    const postUrl = await generateUploadUrl();

    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type":values.file[0]!.type },
      body: values.file[0],
    });
    const { storageId } = await result.json();
    const types={
      "image/png":"image",
    } as Record <string,Doc<"tasks">["type"]>;
   await createFile({
      title:values.title,
      fileId:storageId,
      type:types[values.file[0].type],
      description:values.description,
      price:values.price,
      url:values.url
    })

    form.reset()
    setIsOpen(false)
  }
 

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const response = await fetch("http://192.168.13.223:7000/AllProducts"); // Adjust the API endpoint accordingly
  //       if (response.ok) {
  //         const data = await response.json();
  //         setProducts(data);
  //         console.log(data)
  //       } else {
  //         console.error("Failed to fetch products:", response.statusText);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching products:", error);
  //     }
  //   };

  //   fetchProducts();
  // }, []);

  const [isOpen,setIsOpen]=useState(false)

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-zinc-200 dark:from-black dark:via-black">
      <div className="z-10 w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Click on the cards&nbsp;
          <code className="font-mono font-bold">To get your product</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center lg:static lg:size-auto lg:bg-none">
         
        </div>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger asChild>
  <Button onClick={()=>setIsOpen(true)}>Upload file</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle className="mb-8">Upload the product</DialogTitle>
      <DialogDescription>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="ex : watch.." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="anything about the product" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" placeholder="ex :100" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={() => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input
                type="file"{...fileRef} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
      <div className=" grid md:grid-cols-2 md:gap-8 lg:grid-cols-4 gap-5 my-8 md:w-full">
    
  {Files?.map((file, index) => (
        <Link key={index} href='/'>
          <div className=" w-72 rounded shadow-lg mx-auto border border-palette-lighter">
            <div className="border-b-2 border-palette-lighter flex justify-center items-center py-5">
            <img
                width={250}
                height={250}
                src={file.url || ''}
                alt='product image'
                className="transform duration-500 ease-in-out hover:scale-110"
              />
            </div>
            <div className="">
              <div className="font-primary text-palette-primary text-2xl pt-4 px-4 font-semibold">
                {file.title}
              </div>
              <div className="text-md text-gray-600 p-4 font-primary font-light">
                {file.description}
              </div>
              <div className="text-palette-dark font-primary font-medium text-base mb-4 pl-8 pr-4 pb-1 pt-2 bg-palette-lighter rounded-tl-sm triangle">
                {file.price}
              </div>
            </div>
          </div>
        </Link>
      ))}
      </div>
    </main>
  );
}
