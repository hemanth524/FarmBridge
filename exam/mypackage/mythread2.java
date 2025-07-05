package mypackage;

 public class mythread2 extends Thread{
    public void run()
    {
        while(true)
        {
            System.out.println("john");
            try
            {
                Thread.sleep(2000);
            }catch(InterruptedException e)
            {
                e.printStackTrace();
            }
        }
    }
}