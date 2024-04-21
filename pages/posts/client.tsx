import axios from "axios";
import { SetStateAction, useEffect, useState } from "react";
import { NextPage } from "next";
import ClientHook from '@/hooks/usePosts';


export default function ClientPage() {
  const { posts, isLoading } = ClientHook();
  return (
    <div>
      {isLoading ? (
        <div>加载中</div>
      ) : (
        posts.map((p) => (
          <div key={p.id}>
            {p.id}--{p.content}
          </div>
        ))
      )}
    </div>
  );
}
