import nodemailer from "nodemailer";

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendEmail = async (to: string, subject: string, text: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "butterflies.butterflies.205@gmail.com",
      pass: "cckz dafp ajmg savm",
    },
  });

  await transporter.sendMail({
    from: "butterflies.butterflies.205@gmail.com",
    to,
    subject,
    text,
  });
};
// pass: "cckz dafp ajmg savm"
