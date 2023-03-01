import * as React from 'react';
import { useState, useEffect } from 'react';
import { GetServerSidePropsContext } from "next";
import ErrorPage from "next/error";
import { getArticleDetail } from "../../lib/db";
import { InferGetServerSidePropsType } from "next";
import { Article } from "../../types/blog";
import MarkdownIt from 'markdown-it';
import matter from "gray-matter"
import Prism from "prismjs";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-markdown";

const md = new MarkdownIt()

function Page({ data, statusCode }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    if (statusCode) {
        return <ErrorPage statusCode={statusCode} />
    }
    console.log(data)

    useEffect(() => {
        Prism.highlightAll()
    }, [data])

    const result = matter(data?.article_info.mark_content || "")

    return (<div className='mx-auto prose prose-indigo'>
        <header className='pt-6'>
            <h1>{data?.article_info.title}</h1>
            <dl>
                <dt className='sr-only'>Published on</dt>
                <dd className='text-base font-medium leading-6 text-gray-500'>
                    <time>
                        {new Date(+data?.article_info.ctime! * 1000).toLocaleDateString(
                            "zh-CN",
                            {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            }
                        )}
                    </time>
                </dd>
            </dl>
            {data?.article_info.cover_image && (
                <img
                    className='max-w-full'
                    src={data.article_info.cover_image}
                    alt={data.article_info.title} />
            )}
        </header>
        <div dangerouslySetInnerHTML={{ __html: md.render(result.content) }}></div>
    </div>);
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const slug = context.query?.slug as string[]
    const res = await getArticleDetail(slug[0])
    if (res.err_msg === "success") {
        // 将数据传递给页面
        return { props: { data: res.data as Article } }
    }
    return { props: { statusCode: 404 } }
}

export default Page;