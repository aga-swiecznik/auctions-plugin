import { exec } from "child_process";

const parseCorrectLink = (link: string, oldLink?: string) => {
    const linkRegex = /facebook\.com\/groups\/(\d+)\/(?:posts|permalink)\/(\d+)/g
  
    const linkMatch = linkRegex.exec(link);
    if(linkMatch && linkMatch.length > 2) {
      return {
        link: oldLink ? oldLink : link,
        groupId: linkMatch[1],
        id: linkMatch[2],
        fbId: linkMatch[2]
      }
    }
  }
  
export const parseLink = async (link: string) => {
  let parsed = parseCorrectLink(link);

  if(parsed) return parsed;

  const p = new Promise((resolve, reject) => {
    exec(`curl  -w "%{redirect_url}" -o /dev/null -s "${link}"`, (error, stdout, stderr) => {
      if (error) {
        reject(error.message);
      }
      if (stderr) {
        reject(stderr);
      }

      resolve(stdout);
    });
  });

  const url = (await p) as string;

  if (url) {
    parsed = parseCorrectLink(url, link);

    if(parsed) return parsed;
  }

  throw new Error("Nieprawidłowy link, sprawdź czy post istnieje i czy link jest skopiowany poprawnie.");
}