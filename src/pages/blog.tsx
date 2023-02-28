import * as React from 'react';
import { useState, useEffect } from 'react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { getArticles } from '../lib/db';
import ArticleList from '../component/articleList'

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const page = (context.query?.page as string) || 1;
    // 通过 API 获取数据
    const uid = process.env.uid!;
    const { data, count } = await getArticles(uid, (+page - 1) * 10)
    return { props: { data, count, page: +page } }
}

function Blog({ data, count, page }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    console.log('data', data)
    return <ArticleList totalPages={count} currentPage={page} articles={data} />;
}

export default Blog;