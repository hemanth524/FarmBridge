package mypackage;


public class mythread1 extends Thread{
    public void run()
    {
        while(true)
        {
            System.out.println("good morning");
            try
            {
                Thread.sleep(3000);
            }catch(InterruptedException e)
            {
                e.printStackTrace();
            }
        }
    }
}
