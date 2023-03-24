import Card from "@/components/home/card";
import ComponentGrid from "@/components/home/component-grid";
import Layout from "@/components/layout";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import ErrorPage from "next/error";
import Loading from "@/components/loading";

const fetcher = ([baseUrl, id]: string[]) => {
  if (id) {
    return fetch(`${baseUrl}${id}`).then((res) => {
      const { status } = res;
      if (res.status === 200) return { status, data: res.json() };
      else return { status };
    });
  } else {
    return {};
  }
};

export default function Song() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { push } = router;
  const { id } = router.query;
  const { data, error } = useSWR(["/api/song/", id], fetcher);

  if (!session) {
    if (status === "unauthenticated") {
      push("/");
      return (
        <Layout>
          <Loading />
        </Layout>
      );
    } else if (status === "loading")
      return (
        <Layout>
          <Loading />
        </Layout>
      );
  }
  if (data && "status" in data && data.status !== 200) {
    const errStatus = data.status as number;
    return <ErrorPage statusCode={errStatus} />;
  }

  const features = [
    {
      title: "Built-in Auth + Database",
      description:
        "Precedent comes with authentication and database via [Auth.js](https://authjs.dev/) + [Prisma](https://prisma.io/)",
      demo: (
        <div className="flex items-center justify-center space-x-20">
          <Image alt="Auth.js logo" src="/authjs.webp" width={50} height={50} />
          <Image alt="Prisma logo" src="/prisma.svg" width={50} height={50} />
        </div>
      ),
    },
    {
      title: "Built-in Auth + Database2",
      description:
        "Precedent comes with authentication and database via [Auth.js](https://authjs.dev/) + [Prisma](https://prisma.io/)",
      demo: (
        <div className="flex items-center justify-center space-x-20">
          <Image alt="Auth.js logo" src="/authjs.webp" width={50} height={50} />
          <Image alt="Prisma logo" src="/prisma.svg" width={50} height={50} />
        </div>
      ),
    },
    {
      title: "Built-in Auth + Database3",
      description:
        "Precedent comes with authentication and database via [Auth.js](https://authjs.dev/) + [Prisma](https://prisma.io/)",
      demo: (
        <div className="flex items-center justify-center space-x-20">
          <Image alt="Auth.js logo" src="/authjs.webp" width={50} height={50} />
          <Image alt="Prisma logo" src="/prisma.svg" width={50} height={50} />
        </div>
      ),
    },
  ];
  return (
    <Layout>
      <div className="my-10 grid w-full max-w-screen-xl animate-[slide-down-fade_0.5s_ease-in-out] grid-cols-1 gap-5 px-5 md:grid-cols-3 xl:px-0">
        {features.map(({ title, description, demo }) => (
          <Card
            key={title}
            title={title}
            description={description}
            demo={
              title === "Beautiful, reusable components" ? (
                <ComponentGrid />
              ) : (
                demo
              )
            }
          />
        ))}
      </div>
    </Layout>
  );
}
