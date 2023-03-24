import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// command to run
// $ pnpm prisma db seed

async function main() {
  // const robert = await prisma.user.upsert({
  //   where: { email: "robert@west.com" },
  //   update: {},
  //   create: {
  //     id:
  //     email: "robert@west.com",
  //     name: "robert",
  //     image:
  //       "https://s.gravatar.com/avatar/3eb9a4c230f7e30de20ed6f80c267102?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fro.png",
  //     songs: {
  //       create: [
  //         {
  //           name: "Pride & Joy",
  //           audioUrl: "02 - Pride and Joy.mp3",
  //           artist: "Stevie Ray Vaughan",
  //           duration: 219.402449,
  //           sections: {
  //             create: [
  //               {
  //                 label: "intro",
  //                 start: 0,
  //                 end: 30,
  //                 speed: 0.75,
  //                 loop: true,
  //               },
  //               {
  //                 label: "solo",
  //                 start: 99.01,
  //                 end: 144.1234,
  //                 speed: 0.5,
  //                 loop: true,
  //               },
  //             ],
  //           },
  //         },
  //       ],
  //     },
  //   },
  // });
  // console.log(robert);

  const prideAndJoy = await prisma.song.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      userId: 1,
      name: "Pride & Joy",
      audioUrl: "02 - Pride and Joy.mp3",
      artist: "Stevie Ray Vaughan",
      duration: 219.402449,
      sections: {
        create: [
          {
            label: "intro",
            start: 0,
            end: 30,
            speed: 0.75,
            loop: true,
          },
          {
            label: "solo",
            start: 99.01,
            end: 144.1234,
            speed: 0.5,
            loop: true,
          },
        ],
      },
    },
  });

  const prideAndJoy2 = await prisma.song.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      userId: 1,
      name: "Pride & Joy2",
      audioUrl: "02 - Pride and Joy.mp3",
      artist: "Stevie Ray Vaughan",
      duration: 100,
      sections: {
        create: [
          {
            label: "intro",
            start: 0,
            end: 30,
            speed: 0.75,
            loop: true,
          },
          {
            label: "solo",
            start: 99.01,
            end: 144.1234,
            speed: 0.5,
            loop: true,
          },
        ],
      },
    },
  });

  const anotherSong = await prisma.song.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      userId: 2,
      name: "sooing",
      audioUrl: "sooing.mp3",
      artist: "Dave",
      duration: 100,
    },
  });
}

main().then(async () => {
  await prisma.$disconnect();
  process.exit(1);
});
